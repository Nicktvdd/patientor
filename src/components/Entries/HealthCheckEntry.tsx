import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

interface HealthCheckEntryProps {
 entry : {
	date: string;
	description: string;
	specialist: string;
	healthCheckRating: number;
 }
}

const HealthCheckEntry: React.FC<HealthCheckEntryProps> = ({ entry }) => {
	return (
		<div>
			<h2>Healthcheck Entry <MonitorHeartIcon /> </h2>
			<p>Date: {entry.date}</p>
			<p>Description: {entry.description}</p>
			<p>Specialist: {entry.specialist}</p>
			<p>Healthcheck rating: {entry.healthCheckRating}</p>
		</div>
	);
};


export default HealthCheckEntry;
