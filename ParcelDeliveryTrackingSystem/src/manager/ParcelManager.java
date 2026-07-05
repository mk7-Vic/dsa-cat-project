package manager;

import java.util.ArrayList;
import java.util.HashMap;

import datastructures.ParcelQueue;
import model.Parcel;

public class ParcelManager {

    // Hash Table
    private HashMap<String, Parcel> parcels;

    // Dispatch Queue
    private ParcelQueue dispatchQueue;

    // Constructor
    public ParcelManager() {

        parcels = new HashMap<>();

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

    // Search parcel using HashMap
    public Parcel searchParcel(String parcelID) {

        return parcels.get(parcelID);

    }

    // Delete parcel
    public boolean deleteParcel(String parcelID) {

        if(parcels.containsKey(parcelID)){

            parcels.remove(parcelID);

            return true;

        }

        return false;

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

        if(parcels.isEmpty()){

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

        for(Parcel parcel : parcels.values()){

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

    // Return all parcels (needed for sorting)
    public ArrayList<Parcel> getAllParcels() {

        return new ArrayList<>(parcels.values());

    }

}