package manager;

import java.util.ArrayList;
import algorithms.QuickSort;
import algorithms.Search;
import datastructures.ParcelHashTable;
import datastructures.ParcelQueue;
import model.Parcel;
public class ParcelManager {
    // Custom Hash Table
    private ParcelHashTable parcels;
    // Dispatch Queue
    private ParcelQueue dispatchQueue;
    // Constructor
    public ParcelManager() {
        parcels = new ParcelHashTable();
        dispatchQueue = new ParcelQueue();
    }

    // Register a new parcel
    public boolean registerParcel(Parcel parcel) {
        if(parcels.containsKey(parcel.getParcelID())){
            System.out.println("Parcel ID already exists.");
            return false;
        }
        parcels.put(parcel.getParcelID(), parcel);
        dispatchQueue.enqueue(parcel);
        return true;
    }

    // Search parcel using Custom Hash Table
    public Parcel searchParcel(String parcelID) {
        return parcels.get(parcelID);
    }

    // Delete parcel
    public boolean deleteParcel(String parcelID) {
        return parcels.remove(parcelID);
    }

    // Update parcel status
    public boolean updateParcelStatus(String parcelID, String status) {
        Parcel parcel = parcels.get(parcelID);
        if(parcel == null){
            return false;
        }
        parcel.setStatus(status);
        return true;
    }

    // Display one parcel
    public void displayParcel(String parcelID) {
        Parcel parcel = parcels.get(parcelID);
        if(parcel == null){
            System.out.println("Parcel not found.");
            return;
        }
        parcel.displayParcel();
    }

    // Display all parcels
    public void displayAllParcels() {
        ArrayList<Parcel> parcelList = parcels.getAllParcels();
        if(parcelList.isEmpty()){
            System.out.println("No parcels available.");
            return;
        }

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
        for(Parcel parcel : parcelList){
            System.out.println(parcel);
        }
    }

    // Dispatch next parcel
    public Parcel dispatchNextParcel() {
        Parcel parcel = dispatchQueue.dequeue();
        if(parcel != null){
            parcel.setStatus("Dispatched");
        }
        return parcel;
    }

    // Display dispatch queue
    public void displayDispatchQueue() {
        dispatchQueue.displayQueue();
    }

    // Total parcels
    public int totalParcels() {
        return parcels.size();
    }

    // Return all parcels
    public ArrayList<Parcel> getAllParcels() {
        return parcels.getAllParcels();
    }

    // Sort parcels by priority
    public ArrayList<Parcel> sortParcelsByPriority() {
        ArrayList<Parcel> parcelList = getAllParcels();
        QuickSort.sortByPriority(parcelList);
        return parcelList;
    }

    // Binary Search
    public Parcel binarySearchParcel(String parcelID) {
        ArrayList<Parcel> parcelList = getAllParcels();
        Search.sortByParcelID(parcelList);
        return Search.binarySearch(parcelList, parcelID);
    }

    // Display the Hash Table (for demonstration)
    public void displayHashTable() {
        parcels.display();
    }
}