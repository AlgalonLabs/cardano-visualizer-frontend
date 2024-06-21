import { useRouter } from 'next/router';
import React, {ReactElement, useEffect} from 'react';
import MainLayout from "@/components/layouts/main-layout";
import {NextPageWithLayout} from "@/pages/_app";

const IndexPage: NextPageWithLayout = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/graph');
    }, [router]);

    return null;
};

IndexPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default IndexPage;
