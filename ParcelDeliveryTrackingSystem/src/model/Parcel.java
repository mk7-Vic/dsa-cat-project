package model;

import datastructures.TrackingHistory;
public class Parcel {
    // Attributes
    private String parcelID;
    private String sender;
    private String receiver;
    private String destination;
    private double weight;
    private String priority;
    private String status;

    // Each parcel has its own tracking history
    private TrackingHistory trackingHistory;

    // Constructor
    public Parcel(String parcelID,
                String sender,
                String receiver,
                String destination,
                double weight,
                String priority) {
        this.parcelID = parcelID;
        this.sender = sender;
        this.receiver = receiver;
        this.destination = destination;
        this.weight = weight;
        this.priority = priority;

        // Default status
        this.status = "Registered";

        // Create a tracking history for this parcel
        this.trackingHistory = new TrackingHistory();

        // First tracking event
        trackingHistory.addStatus("Parcel Registered");
    }

    // Getters
    public String getParcelID() {
        return parcelID;
    }

    public String getSender() {
        return sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public String getDestination() {
        return destination;
    }

    public double getWeight() {
        return weight;
    }

    public String getPriority() {
        return priority;
    }

    public String getStatus() {
        return status;
    }

    public TrackingHistory getTrackingHistory() {
        return trackingHistory;
    }

    // Setters
    public void setSender(String sender) {
        this.sender = sender;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public void setStatus(String status) {
        this.status = status;
        // Automatically add every status update
        trackingHistory.addStatus(status);
    }

    // Display Parcel Details

    public void displayParcel() {
        System.out.println("--------------------------------------------");
        System.out.println("Parcel ID      : " + parcelID);
        System.out.println("Sender         : " + sender);
        System.out.println("Receiver       : " + receiver);
        System.out.println("Destination    : " + destination);
        System.out.println("Weight         : " + weight + " kg");
        System.out.println("Priority       : " + priority);
        System.out.println("Status         : " + status);
        System.out.println("--------------------------------------------");

    }

    // Print tracking history
    public void displayTrackingHistory() {
        trackingHistory.displayHistory();
    }

    // String representation
    @Override
    public String toString() {
        return String.format(
                "%-8s %-12s %-12s %-15s %-8.2f %-10s %-15s",
                parcelID,
                sender,
                receiver,
                destination,
                weight,
                priority,
                status
        );
    }
}