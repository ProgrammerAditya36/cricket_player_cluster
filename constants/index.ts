import { PlayerPageHeader, Cluster } from '@/types';

export const PlayerPageHeaders: PlayerPageHeader[] = [
	{
		title: 'Player Name',
		value: 'player',
	},
	{
		title: 'Matches',
		value: 'matches',
	},
	{
		title: 'Runs',
		value: 'runs',
	},
	{
		title: 'Wickets',
		value: 'wickets',
	},
	{
		title: 'Batting Avg',
		value: 'averagebatting',
	},
	{
		title: 'Bowling Avg',
		value: 'averagebowling',
	},
	{
		title: 'Category',
		value: 'gmm_cluster',
	},
];

export const allClusters: Cluster[] = [
	{
		cluster: 0,
		name: 'All-Rounders',
		color: 'bg-red-500 ',
		tagname: 'ALR',
	},
	{
		cluster: 1,
		name: 'Fielding Batsman',
		color: 'bg-blue-500',
		tagname: 'FIELD-BAT',
	},
	{
		cluster: 2,
		name: 'Batting All Rounded',
		color: 'bg-green-500',
		tagname: 'BAT-ALR',
	},
	{
		cluster: 3,
		name: 'Bowlers',
		color: 'bg-yellow-500',
		tagname: 'BOWL',
	},
	{
		cluster: 4,
		name: 'Middle Order Batsmen',
		color: 'bg-indigo-500',
		tagname: 'MID-BAT',
	},
	{
		cluster: 5,
		name: 'Top Order Batsman',
		color: 'bg-purple-500',
		tagname: 'TOP-BAT',
	},
];
