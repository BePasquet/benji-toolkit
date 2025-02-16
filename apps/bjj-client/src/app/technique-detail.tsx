import { Typography } from '@mui/material';
import ReactPlayer from 'react-player';
import { Technique } from './types';

export interface TechniqueDetailProps {
  technique: Technique;
}

export function TechniqueDetail({ technique }: TechniqueDetailProps) {
  return (
    <>
      <div style={{ padding: '20px' }}>
        <Typography variant="h4">{technique.name}</Typography>
      </div>
      <ReactPlayer width="100%" height="100%" url={technique.videoUrl} />
    </>
  );
}
