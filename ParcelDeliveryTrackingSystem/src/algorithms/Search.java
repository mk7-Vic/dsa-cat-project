package algorithms;

import java.util.ArrayList;
import model.Parcel;
public class Search {

    // Sort parcels by Parcel ID using QuickSort
    public static void sortByParcelID(ArrayList<Parcel> parcels) {
        if (parcels == null || parcels.size() <= 1) {
            return;
        }
        quickSort(parcels, 0, parcels.size() - 1);
    }

    // QuickSort
    private static void quickSort(ArrayList<Parcel> parcels, int low, int high) {
        if (low < high) {
            int pivot = partition(parcels, low, high);
            quickSort(parcels, low, pivot - 1);
            quickSort(parcels, pivot + 1, high);
        }
    }

    // Partition
    private static int partition(ArrayList<Parcel> parcels, int low, int high) {
        String pivot = parcels.get(high).getParcelID();
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (parcels.get(j).getParcelID().compareToIgnoreCase(pivot) <= 0) {
                i++;
                swap(parcels, i, j);
            }
        }
        swap(parcels, i + 1, high);
        return i + 1;
    }

    // Swap two parcels
    private static void swap(ArrayList<Parcel> parcels, int i, int j) {
        Parcel temp = parcels.get(i);
        parcels.set(i, parcels.get(j));
        parcels.set(j, temp);
    }

    // Binary Search
    public static Parcel binarySearch(ArrayList<Parcel> parcels, String parcelID) {
        int left = 0;
        int right = parcels.size() - 1;
        while (left <= right) {
            int middle = (left + right) / 2;
            Parcel current = parcels.get(middle);
            int compare = current.getParcelID().compareToIgnoreCase(parcelID);
            if (compare == 0) {
                return current;
            }
            else if (compare < 0) {
                left = middle + 1;
            }
            else {
                right = middle - 1;
            }
        }
        return null;
    }
}