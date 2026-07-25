import express from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { getSettings, updateSettings } from '../settings.js'

const router = express.Router()
router.use(requireAuth)
// Readable by anyone logged into the admin panel (SUPER_ADMIN bypasses via requireRole; ADMIN/
// STAFF need this themselves to render their own sidebar) — editing is SUPER_ADMIN-only, enforced
// inline below since requireRole(['ADMIN','STAFF']) would let a regular admin through too.
router.use(requireRole(['ADMIN', 'STAFF']))

router.get('/', async (req, res) => {
  const settings = await getSettings()
  res.json({
    success: true,
    permissions: {
      adminMenuKeys: settings.adminMenuKeys || [],
      staffMenuKeys: settings.staffMenuKeys || [],
    },
  })
})

router.put('/', async (req, res) => {
  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ success: false, message: 'Only the super admin can change menu access.' })
  }

  const { adminMenuKeys, staffMenuKeys } = req.body ?? {}
  const data = {}
  if (adminMenuKeys !== undefined) {
    if (!Array.isArray(adminMenuKeys)) {
      return res.status(400).json({ success: false, message: 'adminMenuKeys must be a list.' })
    }
    data.adminMenuKeys = adminMenuKeys.map(String)
  }
  if (staffMenuKeys !== undefined) {
    if (!Array.isArray(staffMenuKeys)) {
      return res.status(400).json({ success: false, message: 'staffMenuKeys must be a list.' })
    }
    data.staffMenuKeys = staffMenuKeys.map(String)
  }

  await updateSettings(data)
  const settings = await getSettings()
  res.json({
    success: true,
    permissions: { adminMenuKeys: settings.adminMenuKeys || [], staffMenuKeys: settings.staffMenuKeys || [] },
  })
})

export default router
