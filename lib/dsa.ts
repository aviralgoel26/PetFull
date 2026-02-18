import type { Medicine } from "./types"

// Priority Queue implementation for claim processing
export class PriorityQueue<T> {
  private items: Array<{ value: T; priority: number }> = []

  enqueue(value: T, priority: number): void {
    const item = { value, priority }
    let added = false

    for (let i = 0; i < this.items.length; i++) {
      if (item.priority > this.items[i].priority) {
        this.items.splice(i, 0, item)
        added = true
        break
      }
    }

    if (!added) {
      this.items.push(item)
    }
  }

  dequeue(): T | undefined {
    return this.items.shift()?.value
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }

  size(): number {
    return this.items.length
  }
}

// Binary Search for finding medicines by expiry date
export const binarySearchByExpiry = (medicines: Medicine[], targetDate: Date): number => {
  let left = 0
  let right = medicines.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const midDate = medicines[mid].expiryDate.getTime()
    const targetTime = targetDate.getTime()

    if (midDate === targetTime) return mid
    if (midDate < targetTime) left = mid + 1
    else right = mid - 1
  }

  return -1
}

// Merge Sort for sorting medicines by expiry date (ascending)
export const mergeSortByExpiry = (medicines: Medicine[]): Medicine[] => {
  if (medicines.length <= 1) return medicines

  const mid = Math.floor(medicines.length / 2)
  const left = mergeSortByExpiry(medicines.slice(0, mid))
  const right = mergeSortByExpiry(medicines.slice(mid))

  return merge(left, right)
}

const merge = (left: Medicine[], right: Medicine[]): Medicine[] => {
  const result: Medicine[] = []
  let i = 0,
    j = 0

  while (i < left.length && j < right.length) {
    if (left[i].expiryDate <= right[j].expiryDate) {
      result.push(left[i++])
    } else {
      result.push(right[j++])
    }
  }

  return [...result, ...left.slice(i), ...right.slice(j)]
}

// Quick Sort for sorting medicines by quantity (descending)
export const quickSortByQuantity = (medicines: Medicine[]): Medicine[] => {
  if (medicines.length <= 1) return medicines

  const pivot = medicines[0]
  const left = medicines.slice(1).filter((m) => m.quantity >= pivot.quantity)
  const right = medicines.slice(1).filter((m) => m.quantity < pivot.quantity)

  return [...quickSortByQuantity(left), pivot, ...quickSortByQuantity(right)]
}

// Haversine formula for calculating distance between two coordinates
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Matching algorithm: Find best medicines for a claim
export const findBestMedicineMatches = (
  availableMedicines: Medicine[],
  requiredMedicine: string,
  requiredQuantity: number,
  recipientLocation: { city: string; state: string },
): Medicine[] => {
  // Filter by medicine name and availability
  let matches = availableMedicines.filter(
    (m) =>
      m.name.toLowerCase().includes(requiredMedicine.toLowerCase()) &&
      m.quantity >= requiredQuantity &&
      m.status === "available",
  )

  // Sort by expiry date (ascending - use medicines expiring soon first)
  matches = mergeSortByExpiry(matches)

  // Further sort by location match (same city/state preferred)
  matches.sort((a, b) => {
    const aMatch = a.location.city === recipientLocation.city && a.location.state === recipientLocation.state ? 0 : 1
    const bMatch = b.location.city === recipientLocation.city && b.location.state === recipientLocation.state ? 0 : 1
    return aMatch - bMatch
  })

  return matches.slice(0, 5) // Return top 5 matches
}

// Graph-based recommendation system using adjacency list
export class MedicineGraph {
  private adjacencyList: Map<string, string[]> = new Map()

  addEdge(medicine1: string, medicine2: string): void {
    if (!this.adjacencyList.has(medicine1)) {
      this.adjacencyList.set(medicine1, [])
    }
    if (!this.adjacencyList.has(medicine2)) {
      this.adjacencyList.set(medicine2, [])
    }
    this.adjacencyList.get(medicine1)!.push(medicine2)
    this.adjacencyList.get(medicine2)!.push(medicine1)
  }

  getRelatedMedicines(medicine: string): string[] {
    return this.adjacencyList.get(medicine) || []
  }

  // BFS to find related medicines
  findRelatedMedicines(medicine: string, depth = 2): string[] {
    const visited = new Set<string>()
    const queue: Array<{ medicine: string; depth: number }> = [{ medicine, depth }]
    const result: string[] = []

    while (queue.length > 0) {
      const { medicine: current, depth: currentDepth } = queue.shift()!

      if (visited.has(current) || currentDepth === 0) continue

      visited.add(current)
      if (current !== medicine) result.push(current)

      const neighbors = this.getRelatedMedicines(current)
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push({ medicine: neighbor, depth: currentDepth - 1 })
        }
      }
    }

    return result
  }
}
