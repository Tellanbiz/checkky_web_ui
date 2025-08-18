"use client";

import { useState, useEffect } from 'react';
import type { Company } from '../lib/services/company/models';

export function useCompany() {
    const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
    const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get current company from localStorage on mount
        const storedCompanyId = localStorage.getItem('currentCompanyId');
        const storedCompanyName = localStorage.getItem('currentCompanyName');

        if (storedCompanyId && storedCompanyName) {
            setCurrentCompanyId(storedCompanyId);
            // Create a minimal company object from stored data
            setCurrentCompany({
                id: storedCompanyId,
                name: storedCompanyName,
                email: '',
                phone_number: '',
                address: '',
                created_at: '',
            });
        }

        setLoading(false);
    }, []);

    const updateCurrentCompany = (company: Company) => {
        setCurrentCompany(company);
        setCurrentCompanyId(company.id);
        localStorage.setItem('currentCompanyId', company.id);
        localStorage.setItem('currentCompanyName', company.name);
    };

    const updateCurrentCompanyId = (id: string) => {
        setCurrentCompanyId(id);
        localStorage.setItem('currentCompanyId', id);
    };

    return {
        currentCompany,
        currentCompanyId,
        setCurrentCompany: updateCurrentCompany,
        setCurrentCompanyId: updateCurrentCompanyId,
        loading,
    };
}
