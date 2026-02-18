

import java.util.*;
import java.util.stream.Collectors;

public class DSA {

    // Simple DTOs
    public static class Location {
        public String city;
        public String state;

        public Location(String city, String state) {
            this.city = city;
            this.state = state;
        }
    }

    public static class Food {
        public String id;
        public String name;
        public Date expiryDate;
        public int quantity;
        public String status;
        public Location location;
        public String manufacturer;
        // other fields as needed

        public Food(String id, String name, Date expiryDate, int quantity, String status, Location location) {
            this.id = id;
            this.name = name;
            this.expiryDate = expiryDate;
            this.quantity = quantity;
            this.status = status;
            this.location = location;
        }
    }

    // Priority Queue implementation (higher priority value => dequeued first)
    public static class PriorityQueueGeneric<T> {
        private final List<Item<T>> items = new ArrayList<>();

        private static class Item<T> {
            T value;
            int priority;

            Item(T value, int priority) {
                this.value = value;
                this.priority = priority;
            }
        }

        public void enqueue(T value, int priority) {
            Item<T> item = new Item<>(value, priority);
            int i = 0;
            boolean added = false;
            for (; i < items.size(); i++) {
                if (item.priority > items.get(i).priority) {
                    items.add(i, item);
                    added = true;
                    break;
                }
            }
            if (!added) items.add(item);
        }

        public T dequeue() {
            if (items.isEmpty()) return null;
            return items.remove(0).value;
        }

        public boolean isEmpty() {
            return items.isEmpty();
        }

        public int size() {
            return items.size();
        }
    }

    // Binary Search by expiry (expects sorted by expiry ascending)
    public static int binarySearchByExpiry(List<Food> food, Date targetDate) {
        int left = 0, right = food.size() - 1;
        long target = targetDate.getTime();
        while (left <= right) {
            int mid = (left + right) >>> 1;
            long midTime = food.get(mid).expiryDate.getTime();
            if (midTime == target) return mid;
            if (midTime < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    // Merge sort by expiry (ascending)
    public static List<Food> mergeSortByExpiry(List<Food> food) {
        if (food.size() <= 1) return new ArrayList<>(food);
        int mid = food.size() / 2;
        List<Food> left = mergeSortByExpiry(food.subList(0, mid));
        List<Food> right = mergeSortByExpiry(food.subList(mid, food.size()));
        return merge(left, right);
    }

    private static List<Food> merge(List<Food> left, List<Food> right) {
        List<Food> result = new ArrayList<>();
        int i = 0, j = 0;
        while (i < left.size() && j < right.size()) {
            if (left.get(i).expiryDate.getTime() <= right.get(j).expiryDate.getTime()) {
                result.add(left.get(i++));
            } else {
                result.add(right.get(j++));
            }
        }
        while (i < left.size()) result.add(left.get(i++));
        while (j < right.size()) result.add(right.get(j++));
        return result;
    }

    // Quick sort by quantity (descending)
    public static List<Food> quickSortByQuantity(List<Food> food) {
        if (food.size() <= 1) return new ArrayList<>(food);
        Food pivot = food.get(0);
        List<Food> left = food.subList(1, food.size()).stream()
                .filter(m -> m.quantity >= pivot.quantity)
                .collect(Collectors.toList());
        List<Food> right = food.subList(1, food.size()).stream()
                .filter(m -> m.quantity < pivot.quantity)
                .collect(Collectors.toList());
        List<Food> result = new ArrayList<>();
        result.addAll(quickSortByQuantity(left));
        result.add(pivot);
        result.addAll(quickSortByQuantity(right));
        return result;
    }

    // Haversine formula for distance (km)
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Matching algorithm: find best food for a claim
    public static List<Food> findBestFoodMatches(
            List<Food> availableFood,
            String requiredFood,
            int requiredQuantity,
            Location recipientLocation
    ) {
        String query = requiredFood.toLowerCase();
        List<Food> matches = availableFood.stream()
                .filter(m -> m.name != null && m.name.toLowerCase().contains(query))
                .filter(m -> m.quantity >= requiredQuantity)
                .filter(m -> "available".equalsIgnoreCase(m.status))
                .collect(Collectors.toList());

        matches = mergeSortByExpiry(matches);

        matches.sort((a, b) -> {
            int aMatch = (a.location != null && a.location.city.equals(recipientLocation.city)
                    && a.location.state.equals(recipientLocation.state)) ? 0 : 1;
            int bMatch = (b.location != null && b.location.city.equals(recipientLocation.city)
                    && b.location.state.equals(recipientLocation.state)) ? 0 : 1;
            return Integer.compare(aMatch, bMatch);
        });

        return matches.stream().limit(5).collect(Collectors.toList());
    }

    // Graph-based recommendation system (by names)
    public static class FoodGraph {
        private final Map<String, List<String>> adjacencyList = new HashMap<>();

        public void addEdge(String food1, String food2) {
            adjacencyList.computeIfAbsent(food1, k -> new ArrayList<>()).add(food2);
            adjacencyList.computeIfAbsent(food2, k -> new ArrayList<>()).add(food1);
        }

        public List<String> getRelatedFood(String food) {
            return adjacencyList.getOrDefault(food, Collections.emptyList());
        }

        public List<String> findRelatedFood(String food, int depth) {
            Set<String> visited = new HashSet<>();
            Queue<Pair> queue = new LinkedList<>();
            List<String> result = new ArrayList<>();
            queue.add(new Pair(food, depth));

            while (!queue.isEmpty()) {
                Pair p = queue.poll();
                String current = p.food;
                int currentDepth = p.depth;

                if (visited.contains(current) || currentDepth == 0) continue;

                visited.add(current);
                if (!current.equals(food)) result.add(current);

                for (String neighbor : adjacencyList.getOrDefault(current, Collections.emptyList())) {
                    if (!visited.contains(neighbor)) {
                        queue.add(new Pair(neighbor, currentDepth - 1));
                    }
                }
            }
            return result;
        }

        private static class Pair {
            String food;
            int depth;

            Pair(String food, int depth) {
                this.food = food;
                this.depth = depth;
            }
        }
    }
}