import { allClusters } from '@/constants';
import { cn } from '@/lib/utils';
// Ensure cn function is correctly defined

export const getClusterName = (cluster: number) => {
	if (cluster === null) return 'Unknown';
	const clusterInfo = allClusters.find((c) => c.cluster === cluster);
	return clusterInfo?.name || 'Unknown';
};

export const getClusterTag = (cluster: number) => {
	if (cluster === null) return 'Unknown';
	const clusterInfo = allClusters.find((c) => c.cluster === cluster);
	return clusterInfo?.tagname || 'UNK';
};

export const getBadgeColor = (cluster: number) => {
	const clusterInfo = allClusters.find((c) => c.cluster === cluster);
	return cn(clusterInfo?.color || 'bg-gray-500');
};
