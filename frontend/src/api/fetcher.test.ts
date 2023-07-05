import {
  getSurfaces,
  getCrossSpeciesSimilarity,
  getNimareTerms
} from './fetcher'

describe('API functions', () => {
  beforeEach(() => {
    // Mock the fetch function
    (global.fetch as jest.Mock) = jest.fn(async () =>
      await Promise.resolve({
        json: async () => await Promise.resolve({})
      })
    )
  })

  afterEach(() => {
    // Clear the mock after each test
    (global.fetch as jest.Mock).mockClear()
  })

  describe('getSurfaces', () => {
    it('should fetch surface data for all surfaces', async () => {
      const species = 'human'
      const side = 'left'

      await getSurfaces(species, side)

      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:8000/surfaces/hemispheres?species=${species}&side=${side}`
      )
    })

    it('should return the response data as JSON', async () => {
      const species = 'human'
      const side = 'left'
      const responseData = { surfaces: [] };

      (global.fetch as jest.Mock).mockImplementationOnce(async () =>
        await Promise.resolve({
          json: async () => await Promise.resolve(responseData)
        })
      )

      const result = await getSurfaces(species, side)

      expect(result).toEqual(responseData)
    })
  })

  describe('getCrossSpeciesSimilarity', () => {
    it('should fetch similarity data for a given vertex on a surface', async () => {
      const species = 'human'
      const side = 'left'
      const vertex = 1

      await getCrossSpeciesSimilarity(species, side, vertex)

      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:8000/features/cross_species?seed_species=${species}&seed_side=${side}&seed_vertex=${vertex}`
      )
    })

    it('should return the response data as JSON', async () => {
      const species = 'human'
      const side = 'left'
      const vertex = 1
      const responseData = { similarity: 0.8 };

      (global.fetch as jest.Mock).mockImplementationOnce(async () =>
        await Promise.resolve({
          json: async () => await Promise.resolve(responseData)
        })
      )

      const result = await getCrossSpeciesSimilarity(species, side, vertex)

      expect(result).toEqual(responseData)
    })
  })

  describe('getNimareTerms', () => {
    it('should fetch NiMare terms for a given vertex on a surface', async () => {
      const surface = {
        name: 'surface',
        xCoordinate: [1, 2, 3],
        yCoordinate: [4, 5, 6],
        zCoordinate: [7, 8, 9],
        iFaces: [1, 2, 3],
        jFaces: [4, 5, 6],
        kFaces: [7, 8, 9]
      }
      const vertex = 1

      await getNimareTerms(surface, vertex)

      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:8000/features/nimare?x=${surface.xCoordinate[vertex]}&y=${surface.yCoordinate[vertex]}&z=${surface.zCoordinate[vertex]}`
      )
    })

    it('should return the response data as JSON', async () => {
      const surface = {
        name: 'surface',
        xCoordinate: [1, 2, 3],
        yCoordinate: [4, 5, 6],
        zCoordinate: [7, 8, 9],
        iFaces: [1, 2, 3],
        jFaces: [4, 5, 6],
        kFaces: [7, 8, 9]
      }
      const vertex = 1
      const responseData = { terms: ['term1', 'term2'] };

      (global.fetch as jest.Mock).mockImplementationOnce(async () =>
        await Promise.resolve({
          json: async () => await Promise.resolve(responseData)
        })
      )

      const result = await getNimareTerms(surface, vertex)

      expect(result).toEqual(responseData)
    })
  })
})
