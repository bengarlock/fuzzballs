import {NextResponse} from 'next/server';
import {backendAuthorization} from '../backend-auth';

export async function POST() {
    try {
        await backendAuthorization();
        return NextResponse.json({authorized: true});
    } catch (error) {
        return NextResponse.json(
            {message: error.message || 'Authorization failed.'},
            {status: 502},
        );
    }
}
