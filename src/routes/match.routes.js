import express from 'express'

const router=express.Router();



router.get('/people/:intentId',getCompetiblePerople);
router.get('/groups/:intentId',getExistingGroup);
router.get('/suggestions',aiSuggestionController);

export default router