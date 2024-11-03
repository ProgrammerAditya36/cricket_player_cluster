import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		// Parse the request body
		const data = await req.json();
		console.log('Received data:', data);

		// Send data to the local prediction API
		const response = await axios.post(
			'https://fastapi-ipl-app.onrender.com/predict_cluster',
			data,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		// Return the response from the prediction API
		return NextResponse.json(response.data);
	} catch (error) {
		console.error('Error in API route:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch prediction' },
			{ status: 500 }
		);
	}
}
