import * as admin from 'firebase-admin';

// Initialize once
admin.initializeApp();

export { onEventRegistration }  from './onRegistration';
export { onRequestSubmitted }   from './onRequest';
