import WorkIcon from '@mui/icons-material/Work';

interface OccupationalHealthcareEntryProps {
	entry: {
		employerName: string;
		date: string;
		description: string;
		specialist: string;
	};
}

const OccupationalHealthcareEntry: React.FC<OccupationalHealthcareEntryProps> = ({
	entry }) => {
	return (
		<div>
			<h2>Occupational Healthcare Entry <WorkIcon/> </h2>
			<p>Employer: {entry.employerName}</p>
			<p>Date: {entry.date}</p>
			<p>Description: {entry.description}</p>
			<p>Specialist: {entry.specialist}</p>
		</div>
	);
};

export default OccupationalHealthcareEntry;
