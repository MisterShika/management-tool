'use client';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import Link from "next/link";

export default function AddSchoolPage() {
    const [formData, setFormData] = useState({
        schoolName: '',
        schoolAddress: '',
        schoolLat: '',
        schoolLon: '',
        schoolType: 'ELEMENTARY',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
            <h1 className="text-xl font-semibold mb-4">学校を追加</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">学校名前 *</label>
                    <input
                    name="schoolName"
                    className="w-full border rounded p-2"
                    required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">住所 *</label>
                    <input
                    name="schoolAddress"
                    className="w-full border rounded p-2"
                    required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">タイプ *</label>
                    <select
                        name="type"
                        className="w-full border rounded p-2"
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
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">経度</label>
                    <input
                    name="schoolLon"
                    className="w-full border rounded p-2"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                    学校追加
                </button>

            </form>
        </div>
    );
}   