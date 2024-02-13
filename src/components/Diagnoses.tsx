import { useState, useEffect } from 'react';
import { Diagnosis } from '../types';

interface DiagnosesProps {
  patientCode: string;
}

const Diagnoses: React.FC<DiagnosesProps> = ({ patientCode }) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    fetch('/api/diagnoses')
      .then(response => response.json())
      .then(data => {
        setDiagnoses(data);
      });
  }, []);

  return (
    <div>
      {diagnoses.map((diagnosis: Diagnosis) => (
        <div key={diagnosis.code}>
          {patientCode === diagnosis.code && (
            <li key={diagnosis.code}>
              {diagnosis.code} {diagnosis.name}
            </li>
          )}
        </div>
      ))}
    </div>
  );
};

export default Diagnoses;