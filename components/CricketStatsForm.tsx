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
import { getBadgeColor, getClusterName } from '@/functions';

const formSchema = z.object({
	matches: z.number().int().min(1),
	inningsBat: z.number().int().min(0),
	inningsBowl: z.number().int().min(0),
	notOut: z.number().int().min(0),
	runs: z.number().int().min(0),
	highest: z.number().int().min(0),
	ballsFaced: z.number().int().min(0),
	centuries: z.number().int().min(0),
	fifties: z.number().int().min(0),
	ducks: z.number().int().min(0),
	fours: z.number().int().min(0),
	sixes: z.number().int().min(0),
	oversBowled: z.number().min(0), // This remains as a float
	maidens: z.number().int().min(0),
	runsConceded: z.number().int().min(0),
	wickets: z.number().int().min(0),
	fourWickets: z.number().int().min(0),
	fiveWickets: z.number().int().min(0),
	catches: z.number().int().min(0),
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
	const formatkey = (key: string) => {
		switch (key) {
			case 'matches':
				return 'Matches';
			case 'inningsBat':
				return 'Innings Batted';
			case 'inningsBowl':
				return 'Innings Bowled';
			case 'notOut':
				return 'Not Out';
			case 'runs':
				return 'Runs';
			case 'highest':
				return 'Highest Score';
			case 'ballsFaced':
				return 'Balls Faced';
			case 'centuries':
				return 'Centuries';
			case 'fifties':
				return 'Fifties';
			case 'ducks':
				return 'Ducks';
			case 'fours':
				return 'Fours';
			case 'sixes':
				return 'Sixes';
			case 'oversBowled':
				return 'Overs Bowled';
			case 'maidens':
				return 'Maidens';
			case 'runsConceded':
				return 'Runs Conceded';
			case 'wickets':
				return 'Wickets';
			case 'fourWickets':
				return 'Four Wickets';
			case 'fiveWickets':
				return 'Five Wickets';
			case 'catches':
				return 'Catches';
			default:
				return key;
		}
	};

	return (
		<div>
			<Card className="w-full  mx-auto">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">
						Enter Player Statistics
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
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
													{formatkey(key)}
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														step="0.1"
														// {...field}
														placeholder={`Enter ${formatkey(
															key
														)}`}
														onChange={(e) =>
															field.onChange(
																key ===
																	'oversBowled'
																	? parseFloat(
																			e
																				.target
																				.value
																	  )
																	: parseInt(
																			e
																				.target
																				.value,
																			10
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
								Predict Category
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent
					className={` w-[500px] text-white ${getBadgeColor(
						cluster ?? 0
					)}`}
				>
					<DialogHeader>
						<DialogTitle>Prediction Result</DialogTitle>
						<DialogDescription className="text-white">
							Based on the provided statistics, the player belongs
							to the category:
						</DialogDescription>
					</DialogHeader>
					<div className="text-center py-4">
						<p className="text-4xl font-bold">
							{getClusterName(cluster ?? 0)}
						</p>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
