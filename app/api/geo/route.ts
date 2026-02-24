import { NextRequest } from 'next/server'
import { IP_API_BASE, INATURALIST_PLACES } from '@/lib/constants'
import type { IpApiResponse, PlacesResponse } from '@/types'

function getClientIp (request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp
  return null
}

/**
 * GET /api/geo
 * Uses request IP to infer country, then resolves to an iNaturalist place.
 * Returns { suggestedPlaceId, suggestedPlaceName, countryName } or null on error/localhost.
 */
export async function GET (request: NextRequest) {
  const ip = getClientIp(request)
  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    return Response.json({ suggestedPlaceId: null, suggestedPlaceName: null, countryName: null })
  }

  try {
    const geoUrl = `${IP_API_BASE}/${encodeURIComponent(ip)}?fields=status,country,countryCode,regionName`
    const geoRes = await fetch(geoUrl, { next: { revalidate: 3600 } })
    const geo = (await geoRes.json()) as IpApiResponse
    if (geo?.status !== 'success' || !geo.country) {
      return Response.json({ suggestedPlaceId: null, suggestedPlaceName: null, countryName: null })
    }

    const countryName = geo.country
    const placeRes = await fetch(
      `${INATURALIST_PLACES}?q=${encodeURIComponent(countryName)}`,
      { next: { revalidate: 86400 } }
    )
    const placeData = (await placeRes.json()) as PlacesResponse
    const first = placeData?.results?.[0]
    if (!first) {
      return Response.json({
        suggestedPlaceId: null,
        suggestedPlaceName: null,
        countryName,
      })
    }

    const suggestedPlaceName = first.display_name ?? first.name ?? countryName
    return Response.json({
      suggestedPlaceId: first.id,
      suggestedPlaceName,
      countryName,
    })
  } catch {
    return Response.json({ suggestedPlaceId: null, suggestedPlaceName: null, countryName: null })
  }
}
