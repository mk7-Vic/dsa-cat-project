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
}