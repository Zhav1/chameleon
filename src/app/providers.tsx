'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactNode } from 'react';

interface ProvidersProps {
    children: ReactNode;
}

/**
 * Providers wrapper - includes NuqsAdapter for URL state management
 */
export function Providers({ children }: ProvidersProps) {
    return (
        <NuqsAdapter>
            {children}
        </NuqsAdapter>
    );
}
