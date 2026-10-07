import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const itemsContainer = document.getElementById("itemsContainer");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");
const notificationArea = document.getElementById("notificationArea");

const reportForm = document.getElementById("reportForm");

let allItems = [];
let matches = [];


// Get value from Firestore even if field name has different capital letters
function getValue(item, field) {

    const lowerCaseField = field.toLowerCase();

    const capitalizedField =
        field.charAt(0).toUpperCase() +
        field.slice(1).toLowerCase();

    return (
        item[field] ??
        item[lowerCaseField] ??
        item[capitalizedField] ??
        ""
    );
}


// Load items from Firestore
async function loadItems() {

    try {

        const querySnapshot = await getDocs(
            collection(db, "items")
        );

        allItems = [];

        querySnapshot.forEach((docSnapshot) => {

            allItems.push({
                id: docSnapshot.id,
                data: docSnapshot.data()
            });

        });

        displayItems(allItems);
        checkMatches();

    } catch (error) {

        console.error("Error loading items:", error);

        itemsContainer.innerHTML =
            "<p>Unable to load items.</p>";
    }
}


// Display items on the website
function displayItems(items) {

    itemsContainer.innerHTML = "";

    if (items.length === 0) {

        itemsContainer.innerHTML =
            "<p>No items found.</p>";

        return;
    }


    items.forEach((item) => {

        const data = item.data;

        const type = getValue(data, "type");
        const name = getValue(data, "name");
        const category = getValue(data, "category");
        const description = getValue(data, "description");
        const location = getValue(data, "location");
        const date = getValue(data, "date");
        const status = getValue(data, "status");
        const contact = getValue(data, "contact");


        let imagePath = "";


        if (
            name.toLowerCase().includes("bottle")
        ) {
            imagePath = "assets/bottle.jpg";

        } else if (
            name.toLowerCase().includes("laptop") ||
            name.toLowerCase().includes("hp")
        ) {
            imagePath = "assets/laptop.jpg";

        } else if (
            name.toLowerCase().includes("backpack") ||
            name.toLowerCase().includes("bag")
        ) {
            imagePath = "assets/backpack.jpg";

        } else if (
            name.toLowerCase().includes("pen")
        ) {
            imagePath = "assets/pen.jpg";
        }


        const card = document.createElement("div");

        card.className = "item-card";


        card.innerHTML = `

            <div class="item-image">

                ${
                    imagePath
                    ? `<img src="${imagePath}"
                         alt="${name}"
                         class="item-photo">`
                    : `<div class="no-image">
                         No Image
                       </div>`
                }

            </div>


            <div class="item-content">

                <span class="item-type">
                    ${type}
                </span>

                <h3>${name}</h3>

                <p>
                    <strong>Category:</strong>
                    ${category}
                </p>

                <p>
                    <strong>Description:</strong>
                    ${description}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${location}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${date || "Not provided"}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${status}
                </p>

                <button class="view-btn">
                    View Details
                </button>

            </div>
        `;


        const image =
            card.querySelector(".item-photo");

        if (image) {

            image.addEventListener("click", () => {

                window.open(
                    image.src,
                    "_blank"
                );

            });

        }


        const viewButton =
            card.querySelector(".view-btn");

        viewButton.addEventListener(
            "click",
            () => {

                showItemDetails(
                    data,
                    contact,
                    imagePath
                );

            }
        );


        itemsContainer.appendChild(card);

    });
}


// Show item details
function showItemDetails(
    data,
    contact,
    imagePath
) {

    const details =
        document.getElementById("itemDetails");

    const name =
        getValue(data, "name");

    const description =
        getValue(data, "description");

    const location =
        getValue(data, "location");

    const date =
        getValue(data, "date");

    details.innerHTML = `

        <div class="details-box">

            <h2>${name}</h2>

            ${
                imagePath
                ? `<img src="${imagePath}"
                     class="details-image">`
                : ""
            }

            <p>
                <strong>Description:</strong>
                ${description}
            </p>

            <p>
                <strong>Location:</strong>
                ${location}
            </p>

            <p>
                <strong>Date:</strong>
                ${date || "Not provided"}
            </p>

            <p>
                <strong>Contact:</strong>
                ${contact || "Not provided"}
            </p>

        </div>
    `;
}
// Search and filter
function filterItems() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedType =
        typeFilter.value;

    const selectedCategory =
        categoryFilter.value;

    const selectedStatus =
        statusFilter.value;


    const filteredItems =
        allItems.filter((item) => {

            const data = item.data;

            const type =
                getValue(data, "type").toLowerCase();

            const name =
                getValue(data, "name").toLowerCase();

            const category =
                getValue(data, "category").toLowerCase();

            const description =
                getValue(data, "description").toLowerCase();

            const location =
                getValue(data, "location").toLowerCase();

            const status =
                getValue(data, "status").toLowerCase();


            const matchesSearch =
                name.includes(searchText) ||
                description.includes(searchText) ||
                location.includes(searchText);


            const matchesType =
                selectedType === "All" ||
                type === selectedType.toLowerCase();


            const matchesCategory =
                selectedCategory === "All" ||
                category === selectedCategory.toLowerCase();


            const matchesStatus =
                selectedStatus === "All" ||
                status === selectedStatus.toLowerCase();


            return (
                matchesSearch &&
                matchesType &&
                matchesCategory &&
                matchesStatus
            );

        });


    displayItems(filteredItems);
}


// Search and filter events
searchInput.addEventListener(
    "input",
    filterItems
);

typeFilter.addEventListener(
    "change",
    filterItems
);

categoryFilter.addEventListener(
    "change",
    filterItems
);

statusFilter.addEventListener(
    "change",
    filterItems
);


// Check Lost and Found items for possible matches
function checkMatches() {

    matches = [];

    const lostItems =
        allItems.filter((item) => {

            const type =
                getValue(
                    item.data,
                    "type"
                ).toLowerCase();

            const status =
                getValue(
                    item.data,
                    "status"
                ).toLowerCase();

            return (
                type === "lost" &&
                status !== "resolved"
            );

        });


    const foundItems =
        allItems.filter((item) => {

            const type =
                getValue(
                    item.data,
                    "type"
                ).toLowerCase();

            const status =
                getValue(
                    item.data,
                    "status"
                ).toLowerCase();

            return (
                type === "found" &&
                status !== "resolved"
            );

        });


    lostItems.forEach((lost) => {

        foundItems.forEach((found) => {

            const lostData = lost.data;
            const foundData = found.data;


            const lostName =
                getValue(
                    lostData,
                    "name"
                ).toLowerCase();

            const foundName =
                getValue(
                    foundData,
                    "name"
                ).toLowerCase();


            const lostCategory =
                getValue(
                    lostData,
                    "category"
                ).toLowerCase();

            const foundCategory =
                getValue(
                    foundData,
                    "category"
                ).toLowerCase();


            const lostDescription =
                getValue(
                    lostData,
                    "description"
                ).toLowerCase();

            const foundDescription =
                getValue(
                    foundData,
                    "description"
                ).toLowerCase();


            let score = 0;


            // Same category
            if (
                lostCategory &&
                foundCategory &&
                lostCategory === foundCategory
            ) {
                score += 1;
            }


            // Similar item name
            if (
                lostName &&
                foundName &&
                (
                    lostName.includes(foundName) ||
                    foundName.includes(lostName)
                )
            ) {
                score += 2;
            }


            // Similar description
            if (
                lostDescription &&
                foundDescription &&
                (
                    lostDescription.includes(foundDescription) ||
                    foundDescription.includes(lostDescription)
                )
            ) {
                score += 2;
            }


            // Create match if score is high enough
            if (score >= 2) {

                matches.push({

                    lostId: lost.id,
                    foundId: found.id,

                    lost: lostData,
                    found: foundData

                });

            }

        });

    });


    displayNotifications();
}


// Display possible match notifications
function displayNotifications() {

    notificationArea.innerHTML = "";


    if (matches.length === 0) {

        return;
    }


    matches.forEach((match) => {

        const lostName =
            getValue(
                match.lost,
                "name"
            );

        const foundName =
            getValue(
                match.found,
                "name"
            );


        const notification =
            document.createElement("div");

        notification.className =
            "notification";


        notification.innerHTML = `

            <h3>
                🔔 Possible Match Found!
            </h3>

            <p>
                <strong>Lost item:</strong>
                ${lostName}
            </p>

            <p>
                <strong>Found item:</strong>
                ${foundName}
            </p>

            <p>
                These items have similar details.
                Please verify ownership.
            </p>

            <button class="verify-btn">
                🔐 Verify Ownership
            </button>

        `;


        const verifyButton =
            notification.querySelector(
                ".verify-btn"
            );


        verifyButton.addEventListener(
            "click",
            () => {

                verifyOwnership(
                    match,
                    notification
                );

            }
        );


        notificationArea.appendChild(
            notification
        );

    });
}


// Verify ownership
async function verifyOwnership(
    match,
    notification
) {

    const lostDescription =
        getValue(
            match.lost,
            "description"
        );

    const lostLocation =
        getValue(
            match.lost,
            "location"
        );


    const enteredDescription =
        prompt(
            "Enter the description of your lost item:"
        );


    if (
        !enteredDescription ||
        enteredDescription.toLowerCase().trim() !==
        lostDescription.toLowerCase().trim()
    ) {

        alert(
            "❌ Description does not match."
        );

        return;
    }


    const enteredLocation =
        prompt(
            "Enter the location where you lost the item:"
        );


    if (
        !enteredLocation ||
        enteredLocation.toLowerCase().trim() !==
        lostLocation.toLowerCase().trim()
    ) {

        alert(
            "❌ Location does not match."
        );

        return;
    }


    try {

        await updateDoc(
            doc(
                db,
                "items",
                match.lostId
            ),
            {
                matchStatus: "Verified"
            }
        );


        await updateDoc(
            doc(
                db,
                "items",
                match.foundId
            ),
            {
                matchStatus: "Verified"
            }
        );


        notification.innerHTML = `

            <h3>
                🔐 Ownership Verified
            </h3>

            <p>
                ✅ The ownership details
                have been verified successfully.
            </p>

            <button class="return-btn">
                ✅ Mark as Returned
            </button>

        `;


        const returnButton =
            notification.querySelector(
                ".return-btn"
            );


        returnButton.addEventListener(
            "click",
            () => {

                markAsReturned(
                    match,
                    notification
                );

            }
        );


    } catch (error) {

        console.error(
            "Verification update error:",
            error
        );

        alert(
            "Unable to update ownership status."
        );

    }
}


// Mark item as returned
async function markAsReturned(
    match,
    notification
) {

    const confirmReturn =
        confirm(
            "Are you sure the item has been returned?"
        );


    if (!confirmReturn) {

        return;
    }


    try {

        await updateDoc(
            doc(
                db,
                "items",
                match.lostId
            ),
            {
                Status: "Resolved",
                matchStatus: "Returned"
            }
        );


        await updateDoc(
            doc(
                db,
                "items",
                match.foundId
            ),
            {
                Status: "Resolved",
                matchStatus: "Returned"
            }
        );


        notification.innerHTML = `

            <h3>
                ✅ Item Returned Successfully
            </h3>

            <p>
                The Lost and Found items
                have been marked as Resolved.
            </p>

        `;


        await loadItems();


    } catch (error) {

        console.error(
            "Return update error:",
            error
        );

        alert(
            "Unable to mark item as returned."
        );

    }
}


// Submit report form
reportForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const itemType =
            document.getElementById(
                "itemType"
            );

        const itemName =
            document.getElementById(
                "itemName"
            );

        const itemCategory =
            document.getElementById(
                "itemCategory"
            );

        const itemDescription =
            document.getElementById(
                "itemDescription"
            );

        const itemLocation =
            document.getElementById(
                "itemLocation"
            );

        const itemDate =
            document.getElementById(
                "itemDate"
            );

        const itemPhoto =
            document.getElementById(
                "itemPhoto"
            );

        const itemContact =
            document.getElementById(
                "itemContact"
            );


        let photoName = "";


        if (
            itemPhoto.files.length > 0
        ) {

            photoName =
                itemPhoto.files[0].name;

        }


        try {

            await addDoc(
                collection(db, "items"),
                {

                    type: itemType.value,

                    name: itemName.value,

                    category:
                        itemCategory.value,

                    description:
                        itemDescription.value,

                    Location:
                        itemLocation.value,

                    Date:
                        itemDate.value,

                    Contact:
                        itemContact.value,

                    Status: "Active",

                    matchStatus:
                        "No Match",

                    photo:
                        photoName

                }
            );


            alert(
                "Item reported successfully!"
            );


            reportForm.reset();


            await loadItems();


        } catch (error) {

            console.error(
                "Error adding item:",
                error
            );

            alert(
                "Unable to submit report."
            );

        }

    }
);


// Load items when page opens
loadItems();