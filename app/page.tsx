import { Suspense } from 'react';
import { PlayerStatsTable } from '@/components/player-stats-table';
import { ClusterInfoTable } from '@/components/cluster-info-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CricketStatsForm from '@/components/CricketStatsForm';

export default function HomePage() {
	return (
		<div className="container mx-auto py-10">
			<h1 className="text-4xl text-white font-bold mb-8">
				Player Cluster Model Dashboard
			</h1>
			<Tabs defaultValue="players" className="w-full">
				<TabsList className="bg-slate-500 text-white">
					<TabsTrigger value="players">Player Stats</TabsTrigger>
					<TabsTrigger value="clusters">Cluster Info</TabsTrigger>
					<TabsTrigger value="predictions">
						Predict Your Player
					</TabsTrigger>
				</TabsList>
				<TabsContent value="players">
					<Suspense fallback={<div>Loading player stats...</div>}>
						<PlayerStatsTable />
					</Suspense>
				</TabsContent>
				<TabsContent value="clusters">
					<Suspense fallback={<div>Loading cluster info...</div>}>
						<ClusterInfoTable />
					</Suspense>
				</TabsContent>
				<TabsContent value="predictions">
					<Suspense fallback={<div>Loading predictions...</div>}>
						<CricketStatsForm />
					</Suspense>
				</TabsContent>
			</Tabs>
		</div>
	);
}
