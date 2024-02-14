import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { HealthCheck, Patient, Entry, Hospital, OccupationalHealthcare, Diagnosis } from '../types';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import Diagnoses from './Diagnoses';
import HealthCheckEntry from './Entries/HealthCheckEntry';
import HospitalEntry from './Entries/HospitalEntry';
import OccupationalHealthcareEntry from './Entries/OccupationalHealthcareEntry';
import { Button, Divider, TextField, OutlinedInput, InputLabel, Select, MenuItem } from '@mui/material';
import diagnoses from '../data';

const PatientInfo: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [patient, setPatient] = useState<Patient | null>(null);
	const [newEntry, setNewEntry] = useState<Record<string, string>>({});
	const [errorMessage, setErrorMessage] = useState<string>('');

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		const diagnosisCodes = newEntry.diagnosisCodes ? String(newEntry.diagnosisCodes).split(',') : [];

		if (!newEntry.description || !newEntry.date || !newEntry.specialist || !newEntry.healthCheckRating) {
			setErrorMessage('Please fill in all required fields');
			return;
		}

		let entryToSend: Entry;

		if (newEntry.type === "HealthCheck") {
			entryToSend = {
				...newEntry,
				type: "HealthCheck",
				diagnosisCodes,
			} as HealthCheck;
		} else if (newEntry.type === "Hospital") {
			entryToSend = {
				...newEntry,
				type: "Hospital",
				discharge: {
					date: newEntry.dischargeDate,
					criteria: newEntry.dischargeCriteria,
				},
				diagnosisCodes,
			} as Hospital;
		} else if (newEntry.type === "OccupationalHealthcare") {
			entryToSend = {
				...newEntry,
				type: "OccupationalHealthcare",
				employerName: newEntry.employerName,
				sickLeave: {
					startDate: newEntry.sickLeaveStartDate,
					endDate: newEntry.sickLeaveEndDate,
				},
				diagnosisCodes,
			} as OccupationalHealthcare;
		} else {
			setErrorMessage('Invalid entry type');
			return;
		}

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

	const types = ["HealthCheck", "Hospital", "OccupationalHealthcare"];

	return (
		<div>
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
							{newEntry.diagnosisCodes && Array.isArray(newEntry.diagnosisCodes) && newEntry.diagnosisCodes.map((code: string) =>
								<Diagnoses key={code} patientCode={code} />
							)}
							<Divider />
						</ul>
					</div>
				)}
			</div>
			{errorMessage && <Typography color="error">{errorMessage}</Typography>}
			<Typography variant="h5">New Entry</Typography>
			<form onSubmit={handleSubmit}>
				<Select
					id="type"
					value={newEntry.type || ""}
					onChange={(event) => setNewEntry({ ...newEntry, type: event.target.value as string })}
					input={<OutlinedInput label="Type" />}
				>
					{types.map((type) => (
						<MenuItem
							key={type}
							value={type}
						>
							{type}
						</MenuItem>
					))}
				</Select>
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
				<InputLabel id="Diagnosis">Diagnosis</InputLabel>
				<Select
					id="diagnosisCodes"
					multiple
					value={newEntry.diagnosisCodes || []}
					onChange={(event) => setNewEntry({ ...newEntry, diagnosisCodes: event.target.value as string })}
					input={<OutlinedInput label="Name" />}
				>
					{diagnoses.map((diagnoses: Diagnosis) => (
						<MenuItem key={diagnoses.code} value={diagnoses.code}>{diagnoses.code}</MenuItem>
					))}
				</Select>
				<TextField
					label="Health Check Rating"
					name="healthCheckRating"
					type="number"
					onChange={handleEntryChange}
					fullWidth
				/>
				<TextField
					label="Discharge Date"
					name="dischargeDate"
					type="date"
					onChange={handleEntryChange}
					fullWidth
				/>
				<TextField
					label="Discharge Criteria"
					name="dischargeCriteria"
					onChange={handleEntryChange}
					fullWidth
				/>
				<TextField
					label="Employer Name"
					name="employerName"
					onChange={handleEntryChange}
					fullWidth
				/>
				<TextField
					label="Sick Leave Start Date"
					name="sickLeaveStartDate"
					type="date"
					onChange={handleEntryChange}
					fullWidth
				/>
				<TextField
					label="Sick Leave End Date"
					name="sickLeaveEndDate"
					type="date"
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