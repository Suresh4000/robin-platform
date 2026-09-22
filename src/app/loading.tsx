import { Loader } from '@/shared/components/ui/Loader';

export default function Loading() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            width: '100%'
        }}>
            <Loader width={80} height={80} />
        </div>
    );
}
