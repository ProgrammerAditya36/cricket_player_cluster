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
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowUpDown } from 'lucide-react';
import { PlayerStats } from '@/types';
import PlayerStatsDialog from './player-stats-card';
import { allClusters, PlayerPageHeaders } from '@/constants';
import { getBadgeColor, getClusterName, getClusterTag } from '@/functions';

export function PlayerStatsTable() {
	const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(
		null
	);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortKey, setSortKey] = useState<keyof PlayerStats>('player');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [filterCluster, setFilterCluster] = useState<number | null>(null);

	const {
		data: players,
		isLoading,
		error,
	} = useQuery<PlayerStats[]>({
		queryKey: ['players'],
		queryFn: async () => {
			const response = await axios.get('/api/players');
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
				<p className="text-lg">Error fetching player data</p>
			</div>
		);

	const toggleSortOrder = (key: keyof PlayerStats) => {
		if (sortKey === key) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
		} else {
			setSortKey(key);
			setSortOrder('asc');
		}
	};

	const filteredPlayers = players
		?.filter((player) =>
			player.player.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.filter((player) =>
			filterCluster !== null ? player.gmm_cluster === filterCluster : true
		)
		.sort((a, b) => {
			if (!sortKey) return 0;
			const aValue = a[sortKey];
			const bValue = b[sortKey];
			if (aValue == null) return sortOrder === 'asc' ? 1 : -1;
			if (bValue == null) return sortOrder === 'asc' ? -1 : 1;
			if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
			if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
			return 0;
		});

	return (
		<Card className="shadow-lg bg-slate-100 ">
			<CardContent className="p-6">
				<div className="mb-6 flex flex-col sm:flex-row gap-4">
					<div className="flex-1">
						<Input
							type="text"
							placeholder="Search by player name..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full"
						/>
					</div>
					<Select
						value={filterCluster?.toString() ?? 'all'}
						onValueChange={(value) =>
							setFilterCluster(
								value === 'all' ? null : Number(value)
							)
						}
					>
						<SelectTrigger className="w-full sm:w-[200px]">
							<SelectValue placeholder="All Clusters" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Clusters</SelectItem>
							{allClusters.map((cluster) => (
								<SelectItem
									key={cluster.cluster}
									value={cluster.cluster.toString()}
								>
									{cluster.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow className=" text-white ">
								{PlayerPageHeaders.map((header) => (
									<TableHead
										key={header.value}
										onClick={() =>
											toggleSortOrder(header.value)
										}
										className="cursor-pointer text-center group transition-colors"
									>
										<div className="flex font-semibold items-center justify-center gap-2">
											{header.title}
											<ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
											{sortKey === header.value && (
												<span className="text-primary">
													{sortOrder === 'asc'
														? '↑'
														: '↓'}
												</span>
											)}
										</div>
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredPlayers?.map((player) => (
								<TableRow
									key={`${player.player}-${player.matches}`}
									onClick={() => setSelectedPlayer(player)}
									className="cursor-pointer transition-colors hover:bg-primary/5 text-center"
								>
									{PlayerPageHeaders.map((header) => (
										<TableCell key={header.value}>
											{header.value === 'gmm_cluster' ? (
												<Badge
													className={`${getBadgeColor(
														player.gmm_cluster ?? 0
													)} transition-all hover:scale-105`}
													onClick={(e) => {
														e.stopPropagation();
														setFilterCluster(
															player.gmm_cluster ??
																null
														);
													}}
												>
													{getClusterTag(
														player.gmm_cluster ?? 0
													)}
												</Badge>
											) : (
												<span className="font-medium">
													{typeof player[
														header.value
													] === 'number'
														? Number(
																player[
																	header.value
																]
														  )
														: player[header.value]}
												</span>
											)}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

				{selectedPlayer && (
					<PlayerStatsDialog
						selectedPlayer={selectedPlayer}
						onOpenChange={setSelectedPlayer}
					/>
				)}
			</CardContent>
		</Card>
	);
}
