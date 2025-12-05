'use client';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import Link from "next/link";

export default function AddSchoolPage() {
    const [status, setStatus] = useState(null);
    const [formData, setFormData] = useState({
        schoolName: '',
        schoolAddress: '',
        schoolLat: '',
        schoolLon: '',
        schoolType: 'ELEMENTARY',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch('/api/allSchools', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to create student");

            setStatus("success");
            setFormData({
                schoolName: '',
                schoolAddress: '',
                schoolLat: '',
                schoolLon: '',
                schoolType: 'ELEMENTARY',
            });
        }catch (err) {
            console.error(err);
            setStatus("error");
        }
    }

    return (
        <div className="max-w-md mx-auto mt-5 mb-5 p-6 bg-white rounded-2xl shadow">
            <h1 className="text-xl font-semibold mb-4">学校を追加</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">学校名前 *</label>
                    <input
                    name="schoolName"
                    className="w-full border rounded p-2"
                    value={formData.schoolName}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">住所 *</label>
                    <input
                    name="schoolAddress"
                    className="w-full border rounded p-2"
                    value={formData.schoolAddress}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">タイプ *</label>
                    <select
                        name="type"
                        className="w-full border rounded p-2"
                        value={formData.schoolType}
                        onChange={handleChange}
                        required
                    >
                        <option value="ELEMENTARY">小学校</option>
                        <option value="MIDDLE">中学校</option>
                        <option value="HIGH">高校</option>
                        <option value="OTHER">他</option>
                    </select>
                </div>
                <div>
                    <label className="block font-medium mb-1">緯度</label>
                    <input
                    name="schoolLat"
                    className="w-full border rounded p-2"
                    value={formData.schoolLat}
                    onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">経度</label>
                    <input
                    name="schoolLon"
                    className="w-full border rounded p-2"
                    value={formData.schoolLon}
                    onChange={handleChange}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                    {status === "loading" ? "保存中…" : "学校を追加"}
                </button>

            </form>
        </div>
    );
}   