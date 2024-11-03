// Import specific model types from Prisma Client
import {
	cluster_info as ClusterInfoModel,
	ipl_stats_with_cluster as PlayerStatsModel,
} from '@prisma/client';

// Create type aliases for each model and export them

export type ClusterInfo = ClusterInfoModel;
export type PlayerStats = PlayerStatsModel;
export type PlayerPageHeader = {
	title: string;
	value: keyof PlayerStats;
};
export type Cluster = {
	cluster: number;
	name: string;
	color: string;
	tagname: string;
};
