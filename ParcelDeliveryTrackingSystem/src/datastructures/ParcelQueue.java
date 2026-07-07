package datastructures;

import model.Parcel;
public class ParcelQueue {
    // Queue Node
    private static class QueueNode {
        private Parcel parcel;
        private QueueNode next;
        public QueueNode(Parcel parcel) {
            this.parcel = parcel;
            this.next = null;
        }
    }

    // Front and Rear pointers
    private QueueNode front;
    private QueueNode rear;
    private int size;

    // Constructor
    public ParcelQueue() {
        front = null;
        rear = null;
        size = 0;
    }

    // Add parcel to rear
    public void enqueue(Parcel parcel) {
        QueueNode newNode = new QueueNode(parcel);
        if(isEmpty()){
            front = newNode;
            rear = newNode;
        }

        else{
            rear.next = newNode;
            rear = newNode;
        }
        size++;
    }

    // Remove parcel from front
    public Parcel dequeue() {
        if(isEmpty()){
            System.out.println("Dispatch queue is empty.");
            return null;
        }

        Parcel parcel = front.parcel;
        front = front.next;
        if(front == null){
            rear = null;
        }
        size--;
        return parcel;
    }

    // View first parcel
    public Parcel peek() {
        if(isEmpty()){
            return null;
        }
        return front.parcel;
    }

    // Check if queue is empty
    public boolean isEmpty() {
        return front == null;
    }

    // Number of parcels
    public int size() {
        return size;
    }

    // Display queue
    public void displayQueue() {
        if(isEmpty()){
            System.out.println("No parcels waiting for dispatch.");
            return;
        }
        System.out.println();
        System.out.println("Dispatch Queue");
        System.out.println("--------------------------------------------------------------");
        QueueNode current = front;
        while(current != null){
            System.out.println(current.parcel);
            current = current.next;
        }
    }
    // Custom method to remove a specific parcel by ID (Fixes the ghost dispatch bug)
    public boolean remove(String parcelID) {
        if (isEmpty()) {
            return false;
        }

        // Case 1: The parcel to delete is at the very front of the line
        if (front.parcel.getParcelID().equals(parcelID)) {
            front = front.next;
            if (front == null) {
                rear = null; // The queue is now completely empty
            }
            size--;
            return true;
        }

        // Case 2: The parcel is somewhere in the middle or at the end
        QueueNode current = front;
        QueueNode previous = null;

        while (current != null) {
            if (current.parcel.getParcelID().equals(parcelID)) {
                // Unlink the current node
                previous.next = current.next;
                
                // If we just deleted the very last item, we MUST update the 'rear' pointer
                if (current.next == null) {
                    rear = previous;
                }
                size--;
                return true;
            }
            previous = current;
            current = current.next;
        }
        
        return false; // Parcel wasn't found in the queue
    }
}
