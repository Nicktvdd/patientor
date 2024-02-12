import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { Patient } from '../types';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';


const PatientInfo: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [patient, setPatient] = useState<Patient | null>(null);

	useEffect(() => {
		fetch(`/api/patients/${id}`)
			.then(response => {
				if (!response.ok) {
					throw new Error('Patient not found');
				}
				return response.json();
			})
			.then(data => setPatient(data))
			.catch(error => console.error(error));
	}, [id]);

	if (!patient) {
		return <Typography>Loading...</Typography>;
	}

	const genderIcon = () => {
		if (patient.gender === "male") {
			return <MaleIcon />;
		} else if (patient.gender === "female") {
			return <FemaleIcon />;
		} else {
			return null;
		}
	};

	return (
		<Container>
			<Typography variant="h4">
				{patient.name} {genderIcon()} 
			</Typography>
			
			<Typography variant="body1">{patient.ssn}</Typography>
			<Typography variant="body1">{patient.occupation}</Typography>
		</Container>
	);
};

export default PatientInfo;