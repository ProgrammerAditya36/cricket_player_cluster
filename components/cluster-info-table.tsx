'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { ClusterInfo } from '@/types';
import { getBadgeColor, getClusterName } from '@/functions';

export function ClusterInfoTable() {
	const [selectedCluster, setSelectedCluster] = useState<ClusterInfo | null>(
		null
	);

	const {
		data: clusters,
		isLoading,
		error,
	} = useQuery<ClusterInfo[]>({
		queryKey: ['clusters'],
		queryFn: async () => {
			const response = await axios.get('/api/clusters');
			return response.data;
		},
	});

	if (isLoading)
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);

	if (error)
		return (
			<div className="flex items-center justify-center h-64 text-red-500">
				<p className="text-lg">Error fetching cluster data</p>
			</div>
		);

	return (
		<>
			<Card className="shadow-lg">
				<CardContent className="p-6">
					<Table>
						<TableHeader>
							<TableRow className="bg-primary/5">
								<TableHead className="font-semibold">
									Cluster
								</TableHead>
								<TableHead className="font-semibold text-right">
									Mean Batting Avg
								</TableHead>
								<TableHead className="font-semibold text-right">
									Mean Strike Rate
								</TableHead>
								<TableHead className="font-semibold text-right">
									Mean Bowling Avg
								</TableHead>
								<TableHead className="font-semibold text-right">
									Mean Economy
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{clusters?.map((cluster) => (
								<TableRow
									key={cluster.gmm_cluster}
									onClick={() => setSelectedCluster(cluster)}
									className="cursor-pointer transition-colors hover:bg-primary/5"
								>
									<TableCell className="font-medium">
										<Badge
											variant="secondary"
											className={`text-white ${getBadgeColor(
												cluster.gmm_cluster
											)}`}
										>
											{getClusterName(
												cluster.gmm_cluster
											)}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										{cluster.averagebatting?.toFixed(2) ??
											'0.00'}
									</TableCell>
									<TableCell className="text-right">
										{cluster.strikeratebatting?.toFixed(
											2
										) ?? '0.00'}
									</TableCell>
									<TableCell className="text-right">
										{cluster.averagebowling?.toFixed(2) ??
											'0.00'}
									</TableCell>
									<TableCell className="text-right">
										{cluster.economy?.toFixed(2) ?? '0.00'}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Dialog
				open={!!selectedCluster}
				onOpenChange={() => setSelectedCluster(null)}
			>
				<DialogContent
					className={`w-[500px] text-white ${getBadgeColor(
						selectedCluster?.gmm_cluster ?? 0
					)}`}
				>
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold text-center pb-4 text-white">
							{getClusterName(selectedCluster?.gmm_cluster ?? 0)}
						</DialogTitle>
					</DialogHeader>
					<div className="grid grid-cols-2 gap-6 p-4">
						{[
							{
								label: 'Average Batting',
								value: selectedCluster?.averagebatting,
							},
							{
								label: 'Strike Rate Batting',
								value: selectedCluster?.strikeratebatting,
							},
							{
								label: 'Fours Per Inning',
								value: selectedCluster?.foursperinning,
							},
							{
								label: 'Sixes Per Inning',
								value: selectedCluster?.sixesperinning,
							},
							{
								label: 'Catches Per Match',
								value: selectedCluster?.catchespermatch,
							},
							{
								label: 'Centuries Per Inning',
								value: selectedCluster?.centuriesperinning,
								precision: 4,
							},
							{
								label: 'Fifties Per Inning',
								value: selectedCluster?.fiftiesperinning,
							},
							{
								label: 'Wickets Per Inning',
								value: selectedCluster?.wicketsperinning,
							},
							{
								label: 'Maidens Per Inning',
								value: selectedCluster?.maidensperinning,
							},
							{
								label: 'Average Bowling',
								value: selectedCluster?.averagebowling,
							},
							{
								label: 'Economy',
								value: selectedCluster?.economy,
							},
							{
								label: 'Strike Rate Bowling',
								value: selectedCluster?.strikeratebowling,
							},
						].map((item, index) => (
							<Card key={index} className="p-4 bg-primary/5">
								<p className="text-sm text-white">
									{item.label}
								</p>
								<p className="text-lg font-semibold">
									{item.value?.toFixed(item.precision ?? 2) ??
										'0.00'}
								</p>
							</Card>
						))}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
