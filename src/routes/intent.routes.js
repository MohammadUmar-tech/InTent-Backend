import express from 'express'
import { createIntent,getAllIntent,getsingleIntent } from '../controller/intent.controller.js';

const router=express.Router()

router.post('/',createIntent)
router.get('/mine',getAllIntent);
router.get('/:id',getsingleIntent);
router.patch('/:id',updateController);
router.delete('/:id',deleteIntent);
router.post('/parse',aiController);