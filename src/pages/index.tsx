import { useRouter } from 'next/router';
import { useEffect } from 'react';

const IndexPage: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/graph');
    }, [router]);

    return null;
};

export default IndexPage;