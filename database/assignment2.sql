-- #1 Insert Tony Stark record for table 'Account'
INSERT INTO public.account(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- #2 Update Tony Stark record to account_type 'Admin'
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
-- #3 Delete Tony Stark record 
DELETE FROM public.account
WHERE account_id = 1;
-- #4 Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors"
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- #5 Select the make and model fields from the inventory table that belong to the "Sport" category
SELECT inv_make,
    inv_model
FROM public.inventory
    INNER JOIN public.classification ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';
-- #6 Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');