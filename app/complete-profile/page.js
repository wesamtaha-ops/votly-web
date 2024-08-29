'use client';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ProfileCompletionForm from '../components/CompleteProfile/ProfileCompletionForm';

export default function CompleteProfile() {
  const handleProfileSubmit = async (data) => {
    try {
      const response = await fetch('/api/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit profile');
      }

      alert('Profile completed successfully!');
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('There was an error completing your profile.');
    }
  };

  return (
    <>
      <Header />
      <main className='main-content'>
        <ProfileCompletionForm onSubmit={handleProfileSubmit} />
      </main>
      <Footer />
    </>
  );
}
