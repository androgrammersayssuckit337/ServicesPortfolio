import { db, addDoc, collection, serverTimestamp } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Transmitting...';
        submitBtn.disabled = true;

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const workType = document.getElementById('work-type').value;
        const workDetails = document.getElementById('work-details').value;
        const message = document.getElementById('message').value;

        try {
            await addDoc(collection(db, 'inquiries'), {
                name,
                email,
                workType,
                workDetails,
                message,
                createdAt: serverTimestamp()
            });

            // Show success logic
            submitBtn.textContent = 'Transmission Secured';
            submitBtn.classList.remove('bg-blue-600', 'hover:bg-blue-500');
            submitBtn.classList.add('bg-green-600', 'hover:bg-green-500', 'text-white');
            contactForm.reset();
            
            setTimeout(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.classList.add('bg-blue-600', 'hover:bg-blue-500');
                submitBtn.classList.remove('bg-green-600', 'hover:bg-green-500', 'text-white');
            }, 5000);

        } catch (error) {
            const errInfo = {
                error: error instanceof Error ? error.message : String(error),
                operationType: 'create',
                path: 'inquiries',
                authInfo: {
                  userId: null,
                  email: null,
                  emailVerified: null,
                  isAnonymous: null,
                  tenantId: null,
                  providerInfo: []
                }
            };
            console.error('Firestore Error: ', JSON.stringify(errInfo));
            
            submitBtn.textContent = 'Transmission Failed';
            submitBtn.classList.remove('bg-blue-600', 'hover:bg-blue-500');
            submitBtn.classList.add('bg-red-600', 'hover:bg-red-500', 'text-white');
            
            setTimeout(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.classList.add('bg-blue-600', 'hover:bg-blue-500');
                submitBtn.classList.remove('bg-red-600', 'hover:bg-red-500', 'text-white');
            }, 3000);
            
            throw new Error(JSON.stringify(errInfo));
        }
    });
});
