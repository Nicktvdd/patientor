import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

interface HospitalEntryProps {
	entry: {
		date: string;
		description: string;
		specialist: string;
	};
}

const HospitalEntry: React.FC<HospitalEntryProps> = ({ entry }) => {
	return (
		<div>
			<h2>Hospital Entry <LocalHospitalIcon/></h2>
			<p>Date: {entry.date}</p>
			<p>Description: {entry.description}</p>
			<p>Specialist: {entry.specialist}</p>
		</div>
	);
};

export default HospitalEntry;
