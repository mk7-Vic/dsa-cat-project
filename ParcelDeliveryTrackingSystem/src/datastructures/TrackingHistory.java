package datastructures;

import model.TrackingNode;

public class TrackingHistory {
    // Head of the linked list
    private TrackingNode head;
    // Constructor
    public TrackingHistory() {
        head = null;
    }

    // Add a new status to the end of the list
    public void addStatus(String status) {
        TrackingNode newNode = new TrackingNode(status);
        if(head == null){
            head = newNode;
            return;
        }
        TrackingNode current = head;
        while(current.getNext() != null){
            current = current.getNext();
        }
        current.setNext(newNode);
    }

    // Display the tracking history
    public void displayHistory() {
        if(head == null){
            System.out.println("No tracking history available.");
            return;
        }

        System.out.println("\nTracking History");
        System.out.println("-------------------------");
        TrackingNode current = head;
        while(current != null){
            System.out.println("-> " + current.getStatus());
            current = current.getNext();
        }
    }

    // Return the latest status
    public String getLatestStatus() {
        if(head == null){
            return "No Status";
        }
        TrackingNode current = head;
        while(current.getNext() != null){
            current = current.getNext();
        }
        return current.getStatus();
    }

    // Count number of tracking updates
    public int getHistorySize() {
        int count = 0;
        TrackingNode current = head;
        while(current != null){
            count++;
            current = current.getNext();
        }
        return count;
    }

    // Check if history is empty
    public boolean isEmpty() {
        return head == null;
    }

    // Remove all tracking history
    public void clearHistory() {
        head = null;
    }
}