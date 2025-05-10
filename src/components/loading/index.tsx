import { CircularProgress } from '@mui/material';

type LoadingProps = {
    size?: number;
    message?: string;
};

export default function Loading({ size, message }: LoadingProps) {
    return (
        <div className="flex flex-col items-center">
            <CircularProgress color="primary" size={size || 40} />
            {message && <span className="ml-2 mt-4">{message}</span>}
        </div>
    );
}
