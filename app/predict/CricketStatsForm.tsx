'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import axios from 'axios';

const formSchema = z.object({
	matches: z.number().min(1),
	inningsBat: z.number().min(0),
	inningsBowl: z.number().min(0),
	notOut: z.number().min(0),
	runs: z.number().min(0),
	highest: z.number().min(0),
	ballsFaced: z.number().min(0),
	centuries: z.number().min(0),
	fifties: z.number().min(0),
	ducks: z.number().min(0),
	fours: z.number().min(0),
	sixes: z.number().min(0),
	oversBowled: z.number().min(0),
	maidens: z.number().min(0),
	runsConceded: z.number().min(0),
	wickets: z.number().min(0),
	fourWickets: z.number().min(0),
	fiveWickets: z.number().min(0),
	catches: z.number().min(0),
});

export default function CricketStatsForm() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [cluster, setCluster] = useState<number | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			matches: 49,
			inningsBat: 42,
			inningsBowl: 44,
			notOut: 11,
			runs: 724,
			highest: 65,
			ballsFaced: 575,
			centuries: 0,
			fifties: 13,
			ducks: 4,
			fours: 217,
			sixes: 149,
			oversBowled: 144.5,
			maidens: 0,
			runsConceded: 1077,
			wickets: 36,
			fourWickets: 2,
			fiveWickets: 0,
			catches: 15,
		},
	});

	const calculateDerivedStats = (data: z.infer<typeof formSchema>) => {
		const averageBatting =
			data.inningsBat - data.notOut > 0
				? (data.runs / (data.inningsBat - data.notOut)).toFixed(2)
				: '0.00';
		const strikeRateBatting =
			data.ballsFaced > 0
				? ((data.runs / data.ballsFaced) * 100).toFixed(2)
				: '0.00';
		const averageBowling =
			data.wickets > 0
				? (data.runsConceded / data.wickets).toFixed(2)
				: '0.00';
		const economy =
			data.oversBowled > 0
				? (data.runsConceded / data.oversBowled).toFixed(2)
				: '0.00';
		const strikeRateBowling =
			data.wickets > 0
				? ((data.oversBowled * 6) / data.wickets).toFixed(1)
				: '0.0';

		return {
			averageBatting: parseFloat(averageBatting),
			strikeRateBatting: parseFloat(strikeRateBatting),
			averageBowling: parseFloat(averageBowling),
			economy: parseFloat(economy),
			strikeRateBowling: parseFloat(strikeRateBowling),
		};
	};

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const derivedStats = calculateDerivedStats(data);
		const fullData = { ...data, ...derivedStats };

		try {
			console.log('Full data:', fullData);
			const response = await axios.post(
				'/api/predict_cluster',
				fullData,
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			const result = response.data;
			setCluster(result.cluster);
			setIsDialogOpen(true);
		} catch (error) {
			console.error('Error predicting cluster:', error);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<Card className="w-full max-w-4xl mx-auto">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">
						Cricket Player Statistics
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{Object.keys(form.getValues()).map((key) => (
									<FormField
										key={key}
										control={form.control}
										name={
											key as keyof z.infer<
												typeof formSchema
											>
										}
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{key
														.charAt(0)
														.toUpperCase() +
														key.slice(1)}
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														step="0.1"
														{...field}
														onChange={(e) =>
															field.onChange(
																parseFloat(
																	e.target
																		.value
																)
															)
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								))}
							</div>
							<Button type="submit" className="w-full">
								Predict Cluster
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
					<DialogHeader>
						<DialogTitle>Prediction Result</DialogTitle>
						<DialogDescription>
							Based on the provided statistics, the player belongs
							to:
						</DialogDescription>
					</DialogHeader>
					<div className="text-center py-4">
						<p className="text-4xl font-bold">Cluster {cluster}</p>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}