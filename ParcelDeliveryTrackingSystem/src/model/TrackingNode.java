package model;

public class TrackingNode {

    // Data stored in each node
    private String status;

    // Reference to the next node
    private TrackingNode next;

    // Constructor
    public TrackingNode(String status) {

        this.status = status;
        this.next = null;

    }

    // Getter for status
    public String getStatus() {

        return status;

    }

    // Setter for status
    public void setStatus(String status) {

        this.status = status;

    }

    // Getter for next node
    public TrackingNode getNext() {

        return next;

    }

    // Setter for next node
    public void setNext(TrackingNode next) {

        this.next = next;

    }

}