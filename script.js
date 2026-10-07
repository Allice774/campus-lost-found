import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";


// ===============================
// ELEMENTS
// ===============================

const itemsContainer =
    document.getElementById("itemsContainer");

const notificationArea =
    document.getElementById("notificationArea");

const searchInput =
    document.getElementById("searchInput");

const typeFilter =
    document.getElementById("typeFilter");

const categoryFilter =
    document.getElementById("categoryFilter");

const statusFilter =
    document.getElementById("statusFilter");

const reportForm =
    document.getElementById("reportForm");

const itemType =
    document.getElementById("itemType");

const itemName =
    document.getElementById("itemName");

const itemCategory =
    document.getElementById("itemCategory");

const itemDescription =
    document.getElementById("itemDescription");

const itemLocation =
    document.getElementById("itemLocation");

const itemDate =
    document.getElementById("itemDate");

const itemPhoto =
    document.getElementById("itemPhoto");

const itemContact =
    document.getElementById("itemContact");


// ===============================
// STORE ALL ITEMS
// ===============================

let allItems = [];


// ===============================
// GET VALUE
// Handles different Firebase
// field name capitalization
// ===============================

function getValue(item, field) {

    return item[field] ??
           item[field.toLowerCase()] ??
           "";

}


// ===============================
// LOAD ITEMS FROM FIREBASE
// ===============================

async function loadItems() {

    try {

        const snapshot =
            await getDocs(
                collection(db, "items")
            );

        allItems = [];

        snapshot.forEach((doc) => {

            allItems.push({

                id: doc.id,

                data: doc.data()

            });

        });


        displayItems(allItems);

        checkMatches();

    }

    catch (error) {

        console.error(
            "Error loading items:",
            error
        );

        itemsContainer.innerHTML =
            "<p>Unable to load items. Please try again.</p>";

    }

}


// ===============================
// DISPLAY ITEMS
// ===============================

function displayItems(items) {

    itemsContainer.innerHTML = "";


    if (items.length === 0) {

        itemsContainer.innerHTML =
            "<p>No items found.</p>";

        return;

    }


    items.forEach((itemObject) => {

        const item =
            itemObject.data;


        const name =
            getValue(item, "name");

        const type =
            getValue(item, "type");

        const category =
            getValue(item, "category");

        const description =
            getValue(item, "description");

        const location =
            getValue(item, "Location");

        const date =
            getValue(item, "Date");

        const status =
            getValue(item, "Status");


        // ===============================
        // FIND IMAGE
        // ===============================

        const searchText = (

            name + " " +
            description + " " +
            location + " " +
            category

        ).toLowerCase();


        let image = "";


        if (
            searchText.includes("water bottle") ||
            searchText.includes("bottle")
        ) {

            image =
                "assets/bottle.jpg";

        }

        else if (
            searchText.includes("laptop") ||
            searchText.includes("hp")
        ) {

            image =
                "assets/laptop.jpg";

        }

        else if (
            searchText.includes("backpack") ||
            searchText.includes("bag")
        ) {

            image =
                "assets/backpack.jpg";

        }

        else if (
            searchText.includes("pen")
        ) {

            image =
                "assets/pen.jpg";

        }


        // ===============================
        // CREATE CARD
        // ===============================

        const card =
            document.createElement("div");

        card.className =
            "item-card";


        card.innerHTML = `

            <img
                src="${image}"
                alt="${name}"
                class="item-image"
                title="Click to view image"
            >

            <h3>${name}</h3>

            <p>${description}</p>

            <p>
                <strong>Type:</strong>
                ${type}
            </p>

            <p>
                <strong>Category:</strong>
                ${category}
            </p>

            <p>
                <strong>Location:</strong>
                ${location}
            </p>

            <p>
                <strong>Date:</strong>
                ${date}
            </p>

            <p>
                <strong>Status:</strong>
                ${status}
            </p>

            <button class="view-image-btn">
                View Image
            </button>

        `;


        // ===============================
        // IMAGE BUTTON
        // ===============================

        const imageElement =
            card.querySelector(
                ".item-image"
            );

        const viewButton =
            card.querySelector(
                ".view-image-btn"
            );


        function openImage() {

            if (image) {

                const imageUrl =
                    new URL(
                        image,
                        window.location.href
                    ).href;

                window.open(
                    imageUrl,
                    "_blank"
                );

            }

            else {

                alert(
                    "Image not found for this item."
                );

            }

        }


        imageElement.addEventListener(
            "click",
            openImage
        );

        viewButton.addEventListener(
            "click",
            openImage
        );


        itemsContainer.appendChild(
            card
        );

    });

}


// ===============================
// SEARCH + FILTER
// ===============================

function filterItems() {

    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedType =
        typeFilter.value
            .toLowerCase();


    const selectedCategory =
        categoryFilter.value
            .toLowerCase();


    const selectedStatus =
        statusFilter.value
            .toLowerCase();


    const filteredItems =
        allItems.filter(
            (itemObject) => {

                const item =
                    itemObject.data;


                const name =
                    getValue(
                        item,
                        "name"
                    ).toLowerCase();


                const type =
                    getValue(
                        item,
                        "type"
                    ).toLowerCase();


                const category =
                    getValue(
                        item,
                        "category"
                    ).toLowerCase();


                const description =
                    getValue(
                        item,
                        "description"
                    ).toLowerCase();


                const location =
                    getValue(
                        item,
                        "Location"
                    ).toLowerCase();


                const status =
                    getValue(
                        item,
                        "Status"
                    ).toLowerCase();


                const matchesSearch =

                    searchValue === "" ||

                    name.includes(
                        searchValue
                    ) ||

                    description.includes(
                        searchValue
                    ) ||

                    location.includes(
                        searchValue
                    );


                const matchesType =

                    selectedType === "" ||

                    selectedType === "all" ||

                    type === selectedType;


                const matchesCategory =

                    selectedCategory === "" ||

                    selectedCategory === "all" ||

                    category === selectedCategory;


                const matchesStatus =

                    selectedStatus === "" ||

                    selectedStatus === "all" ||

                    status === selectedStatus;


                return (

                    matchesSearch &&

                    matchesType &&

                    matchesCategory &&

                    matchesStatus

                );

            }
        );


    displayItems(
        filteredItems
    );

}


// ===============================
// SEARCH/FILTER EVENTS
// ===============================

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


// ===============================
// POSSIBLE MATCH SYSTEM
// ===============================

function checkMatches() {

    // Find valid LOST items

    const lostItems =
        allItems.filter(
            (itemObject) => {

                const item =
                    itemObject.data;


                const type =
                    getValue(
                        item,
                        "type"
                    ).toLowerCase().trim();


                const status =
                    getValue(
                        item,
                        "Status"
                    ).toLowerCase().trim();


                const name =
                    getValue(
                        item,
                        "name"
                    ).trim();


                return (

                    type === "lost" &&

                    status !== "resolved" &&

                    name !== ""

                );

            }
        );


    // Find valid FOUND items

    const foundItems =
        allItems.filter(
            (itemObject) => {

                const item =
                    itemObject.data;


                const type =
                    getValue(
                        item,
                        "type"
                    ).toLowerCase().trim();


                const status =
                    getValue(
                        item,
                        "Status"
                    ).toLowerCase().trim();


                const name =
                    getValue(
                        item,
                        "name"
                    ).trim();


                return (

                    type === "found" &&

                    status !== "resolved" &&

                    name !== ""

                );

            }
        );


    const matches = [];


    // Compare Lost with Found

    lostItems.forEach(
        (lostObject) => {

            const lost =
                lostObject.data;


            const lostName =
                getValue(
                    lost,
                    "name"
                ).toLowerCase().trim();


            const lostCategory =
                getValue(
                    lost,
                    "category"
                ).toLowerCase().trim();


            const lostDescription =
                getValue(
                    lost,
                    "description"
                ).toLowerCase().trim();


            foundItems.forEach(
                (foundObject) => {

                    const found =
                        foundObject.data;


                    const foundName =
                        getValue(
                            found,
                            "name"
                        ).toLowerCase().trim();


                    const foundCategory =
                        getValue(
                            found,
                            "category"
                        ).toLowerCase().trim();


                    const foundDescription =
                        getValue(
                            found,
                            "description"
                        ).toLowerCase().trim();


                    // Do not compare empty items

                    if (
                        lostName === "" ||
                        foundName === ""
                    ) {

                        return;

                    }


                    let score = 0;


                    // Same category

                    if (
                        lostCategory !== "" &&
                        foundCategory !== "" &&
                        lostCategory === foundCategory
                    ) {

                        score++;

                    }


                    // Similar name

                    if (
                        lostName.includes(
                            foundName
                        ) ||
                        foundName.includes(
                            lostName
                        )
                    ) {

                        score += 2;

                    }


                    // Similar description

                    if (
                        lostDescription !== "" &&
                        foundDescription !== "" &&
                        (
                            lostDescription.includes(
                                foundDescription
                            ) ||
                            foundDescription.includes(
                                lostDescription
                            )
                        )
                    ) {

                        score++;

                    }


                    // Possible match

                    if (score >= 2) {

                        matches.push({

                            lost: lost,

                            found: found

                        });

                    }

                }
            );

        }
    );


    displayNotifications(
        matches
    );

}


// ===============================
// DISPLAY MATCH NOTIFICATIONS
// ===============================

function displayNotifications(
    matches
) {

    notificationArea.innerHTML = "";


    if (matches.length === 0) {

        return;

    }


    matches.forEach(
        (match) => {

            const lostName =
                getValue(
                    match.lost,
                    "name"
                ).trim();


            const foundName =
                getValue(
                    match.found,
                    "name"
                ).trim();


            // Never show blank names

            if (
                lostName === "" ||
                foundName === ""
            ) {

                return;

            }


            const notification =
                document.createElement(
                    "div"
                );


            notification.className =
                "match-notification";


            notification.innerHTML = `

                🔔 <strong>
                Possible Match Found!
                </strong>

                <p>
                    Lost item:
                    <strong>${lostName}</strong>
                </p>

                <p>
                    Found item:
                    <strong>${foundName}</strong>
                </p>

                <p>
                    These items have similar
                    details. Please verify ownership.
                </p>

            `;


            notificationArea.appendChild(
                notification
            );

        }
    );

}


// ===============================
// REPORT ITEM
// SAVE TO FIRESTORE
// ===============================

reportForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        try {

            // Get photo file name only.
            // Actual image upload to Firebase
            // Storage is not being used yet.

            const photoName =
                itemPhoto.files.length > 0
                    ? itemPhoto.files[0].name
                    : "";


            // Save report to Firestore

            await addDoc(
                collection(db, "items"),
                {

                    type:
                        itemType.value,

                    name:
                        itemName.value,

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

                    Status:
                        "Active",

                    matchStatus:
                        "No Match",

                    photo:
                        photoName

                }
            );


            alert(
                "Item reported successfully!"
            );


            // Clear form

            reportForm.reset();


            // Reload Firebase items

            await loadItems();

        }

        catch (error) {

            console.error(
                "Error adding item:",
                error
            );


            alert(
                "Unable to report item. Please try again."
            );

        }

    }
);


// ===============================
// START APPLICATION
// ===============================

loadItems();