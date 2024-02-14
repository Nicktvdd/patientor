import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { HealthCheck, Patient } from '../types';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import Diagnoses from './Diagnoses';
import HealthCheckEntry from './Entries/HealthCheckEntry';
import HospitalEntry from './Entries/HospitalEntry';
import OccupationalHealthcareEntry from './Entries/OccupationalHealthcareEntry';
import { Entry } from '../types';
import { Button, Divider, TextField } from '@mui/material';

const PatientInfo: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [patient, setPatient] = useState<Patient | null>(null);
	const [newEntry, setNewEntry] = useState<Record<string, string>>({});
	const [errorMessage, setErrorMessage] = useState<string>('');

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		const diagnosisCodes = newEntry.diagnosisCodes ? newEntry.diagnosisCodes.split(',') : [];

		if (!newEntry.description || !newEntry.date || !newEntry.specialist || !newEntry.healthCheckRating) {
			setErrorMessage('Please fill in all required fields');
			return;
		}
		
		const entryToSend: HealthCheck = {
			...newEntry,
			type: "HealthCheck",
			diagnosisCodes,
		} as HealthCheck;

		fetch(`/api/patients/${id}/entries`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(entryToSend),
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to submit form');
				}
				return response.json();
			})
			.then(data => setPatient(data))
			.catch(error => setErrorMessage(error.message));
	};

	const handleEntryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewEntry(prevState => ({
			...prevState,
			[event.target.name]: event.target.value,
		}));
	};

	useEffect(() => {
		fetch(`/api/patients/${id}`)
			.then(response => {
				if (!response.ok) {
					throw new Error('Patient not found');
				}
				return response.json();
			})
			.then(data => setPatient(data))
			.catch(error => setErrorMessage(error.message));
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

	const assertNever = (value: never): never => {
		throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
	};

	const entryDetails = (entry: Entry) => {
		switch (entry.type) {
			case "Hospital":
				return <HospitalEntry entry={entry} />;
			case "OccupationalHealthcare":
				return <OccupationalHealthcareEntry entry={entry} />;
			case "HealthCheck":
				return <HealthCheckEntry entry={entry} />;
			default:
				return assertNever(entry);
		}
	};

	return (
		<div>
			<Typography variant="h4">
				{patient.name} {genderIcon()}
			</Typography>
			<Typography variant="body1">{patient.ssn}</Typography>
			<Typography variant="body1">{patient.occupation}</Typography>
			<Divider />
			<Typography variant="h5">Entries</Typography>
			{patient.entries && patient.entries.map(entry =>
				<div key={entry.id}>
					{entryDetails(entry)}
					<ul>
						{entry.diagnosisCodes && entry.diagnosisCodes.map((code) =>
							<Diagnoses key={code} patientCode={code} />
						)}
						<Divider />
					</ul>

				</div>
			)}
			{errorMessage && <Typography color="error">{errorMessage}</Typography>}
			<Typography variant="h5">New Healthcheck Entry</Typography>
			<form onSubmit={handleSubmit}>
				<TextField
					label="Description"
					name="description"
					onChange={handleEntryChange}
					fullWidth
				/>
				<TextField
					name="date"
					type="date"
					onChange={handleEntryChange}
					fullWidth
				/>
				<TextField
					label="Specialist"
					name="specialist"
					onChange={handleEntryChange}
					fullWidth
				/>
				<TextField
					label="Diagnosis Codes"
					name="diagnosisCodes"
					onChange={handleEntryChange}
					fullWidth
				/>
				<TextField
					label="Health Check Rating"
					name="healthCheckRating"
					type="number"
					onChange={handleEntryChange}
					fullWidth
				/>
				<Button type="submit" variant="contained" color="primary">
					Add entry
				</Button>
			</form>
		</div>
	);
};

export default PatientInfo;