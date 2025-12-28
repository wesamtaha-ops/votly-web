import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import HomeContent from '../components/Home/HomeContent';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // If user is logged in, redirect to surveys
  if (session) {
    return redirect('/surveys');
  }

  return <HomeContent />;
}
