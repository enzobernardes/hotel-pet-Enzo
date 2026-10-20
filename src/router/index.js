import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/pets',
    },
    {
      path: '/pets',
      name: 'pets',
      component: () => import('@/views/PetsView.vue'),
    },
    {
      path: '/pets/novo',
      name: 'addPet',
      component: () => import('@/views/AddPetView.vue'),
    },
    {
      path: '/pets/:id',
      name: 'petDetails',
      component: () => import('@/views/petDetails.vue'),
    },
    {
      path: '/tutores',
      name: 'tutores',
      component: () => import('@/views/TutorsView.vue'),
    },
    {
      path: '/tutores/novo',
      name: 'addTutor',
      component: () => import('@/views/AddTutor.vue'),
    },
    {
      path: '/tutores/:id',
      name: 'tutorDetails',
      component: () => import('@/views/tutorDetails.vue'),
    },
  ],
});

export default router;
