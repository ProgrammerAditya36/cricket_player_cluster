import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PlayerStats } from '@/types';
import { getBadgeColor, getClusterName } from '@/functions';
const StatItem = ({
	label,
	value,
}: {
	label: string;
	value: number | string | null;
}) => (
	<div className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
		<div className="text-sm text-slate-500 mb-1">{label}</div>
		<div className="text-lg font-semibold text-slate-700">
			{value || '0'}
		</div>
	</div>
);
interface PlayerCardProps {
	selectedPlayer: PlayerStats;
	onOpenChange: any;
}
const PlayerStatsDialog = ({
	selectedPlayer,
	onOpenChange,
}: PlayerCardProps) => {
	return (
		<Dialog open={!!selectedPlayer} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold flex items-center justify-between">
						<span>{selectedPlayer?.player}</span>
						<Badge
							className={getBadgeColor(
								selectedPlayer.gmm_cluster ?? 0
							)}
						>
							{getClusterName(selectedPlayer.gmm_cluster ?? 0)}
						</Badge>
					</DialogTitle>
				</DialogHeader>

				<div className="mt-4">
					<h3 className="text-lg font-semibold text-slate-900 mb-3">
						Batting Stats
					</h3>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						<StatItem
							label="Matches"
							value={selectedPlayer?.matches}
						/>
						<StatItem
							label="Innings Batted"
							value={selectedPlayer?.inningsbat}
						/>
						<StatItem label="Runs" value={selectedPlayer?.runs} />
						<StatItem
							label="Highest Score"
							value={selectedPlayer?.highest}
						/>
						<StatItem
							label="Batting Average"
							value={selectedPlayer?.averagebatting}
						/>
						<StatItem
							label="Strike Rate"
							value={selectedPlayer?.strikeratebatting}
						/>
						<StatItem
							label="Centuries"
							value={selectedPlayer?.centuries}
						/>
						<StatItem
							label="Fifties"
							value={selectedPlayer?.fifties}
						/>
						<StatItem label="Fours" value={selectedPlayer?.fours} />
						<StatItem label="Sixes" value={selectedPlayer?.sixes} />
						<StatItem label="Ducks" value={selectedPlayer?.ducks} />
						<StatItem
							label="Not Outs"
							value={selectedPlayer?.notout}
						/>
					</div>
				</div>

				<Separator className="my-6" />

				<div>
					<h3 className="text-lg font-semibold text-slate-900 mb-3">
						Bowling Stats
					</h3>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						<StatItem
							label="Innings Bowled"
							value={selectedPlayer?.inningsbowl}
						/>
						<StatItem
							label="Overs"
							value={selectedPlayer?.oversbowled}
						/>
						<StatItem
							label="Wickets"
							value={selectedPlayer?.wickets}
						/>
						<StatItem
							label="Runs Conceded"
							value={selectedPlayer?.runsconceded}
						/>
						<StatItem
							label="Bowling Average"
							value={selectedPlayer?.averagebowling}
						/>
						<StatItem
							label="Economy"
							value={selectedPlayer?.economy}
						/>
						<StatItem
							label="Strike Rate"
							value={selectedPlayer?.strikeratebowling}
						/>
						<StatItem
							label="Maidens"
							value={selectedPlayer?.maidens}
						/>
						<StatItem
							label="4 Wicket Hauls"
							value={selectedPlayer?.fourwickets}
						/>
						<StatItem
							label="5 Wicket Hauls"
							value={selectedPlayer?.fivewickets}
						/>
					</div>
				</div>

				<Separator className="my-6" />

				<div>
					<h3 className="text-lg font-semibold text-slate-900 mb-3">
						Fielding Stats
					</h3>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						<StatItem
							label="Catches"
							value={selectedPlayer?.catches}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default PlayerStatsDialog;
