'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from '@/components/Loading';

export default function SingleSchoolPage() {
    const { id } = useParams();
    const [schoolData, setSchoolData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSchool() {
            try{
                const res = await fetch(`/api/allSchools/byId/${id}`);
                const data = await res.json();
                setSchoolData(data);
            } catch(err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchSchool();
    }, [id]);   

    if (loading) return <Loading />;

    return (
        <div>Single School Page</div>   
    )
}