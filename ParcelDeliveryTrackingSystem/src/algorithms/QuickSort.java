package algorithms;
import java.util.ArrayList;
import model.Parcel;
public class QuickSort {
    // Sort parcels by priority
    public static void sortByPriority(ArrayList<Parcel> parcels) {
        if(parcels == null || parcels.size() <= 1){
            return;
        }
        quickSort(parcels, 0, parcels.size() - 1);
    }

    // Recursive QuickSort
    private static void quickSort(ArrayList<Parcel> parcels, int low, int high) {
        if(low < high){
            int pivotIndex = partition(parcels, low, high);
            quickSort(parcels, low, pivotIndex - 1);
            quickSort(parcels, pivotIndex + 1, high);
        }
    }

    // Partition method
    private static int partition(ArrayList<Parcel> parcels, int low, int high) {
        int pivot = priorityValue(parcels.get(high).getPriority());
        int i = low - 1;
        for(int j = low; j < high; j++){
            if(priorityValue(parcels.get(j).getPriority()) <= pivot){
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

    // Convert priority into numeric values
    private static int priorityValue(String priority) {
        switch(priority.toLowerCase()){
            case "high":
                return 1;

            case "medium":
                return 2;

            case "low":
                return 3;

            default:
                return 4;
        }
    }

    // Display sorted parcels
    public static void displaySorted(ArrayList<Parcel> parcels){
        System.out.println();
        System.out.printf("%-8s %-12s %-12s %-15s %-8s %-10s %-15s%n",
                "ID",
                "Sender",
                "Receiver",
                "Destination",
                "Weight",
                "Priority",
                "Status");
        System.out.println("--------------------------------------------------------------------------");

        for(Parcel parcel : parcels){
            System.out.println(parcel);
        }
    }
}