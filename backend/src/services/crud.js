import { HttpError, asyncHandler } from '../utils/httpError.js';
import { removeImage } from './storage.js';

// Builds list/create/update/remove handlers for a Mongoose model.
export function crud(Model, { sort = { order: 1, createdAt: -1 } } = {}) {
  return {
    list: asyncHandler(async (_req, res) => res.json(await Model.find().sort(sort))),
    create: asyncHandler(async (req, res) => res.status(201).json(await Model.create(req.body))),
    update: asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!doc) throw new HttpError(404, 'Record not found');
      res.json(doc);
    }),
    remove: asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) throw new HttpError(404, 'Record not found');
      await removeImage(doc.publicId || doc.coverPublicId);
      for (const s of doc.screenshots || []) await removeImage(s.publicId);
      res.json({ ok: true });
    }),
  };
}
