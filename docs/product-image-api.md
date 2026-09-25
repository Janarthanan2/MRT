# MRT Metal Mart — Product Image API Contract

Base URL used by the UI: /api

## Customer/read endpoint

GET /api/products/{productId}/images

Returns product images ordered by displayOrder.

## Admin endpoints

POST /api/admin/products/{productId}/images

Multipart form-data:
- image: image file
- isPrimary: true or false

Recommended response: HTTP 201 with the created ProductImage.

PATCH /api/admin/products/{productId}/images/{imageId}/primary

Marks the image as the product's primary image and clears the previous primary image.

DELETE /api/admin/products/{productId}/images/{imageId}

Deletes the image record and its stored object.

## Suggested Spring Boot mapping

@PostMapping(value = "/admin/products/{productId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@PreAuthorize("hasAnyRole('ADMIN','STAFF')")
public ResponseEntity<ProductImageResponse> upload(
    @PathVariable Long productId,
    @RequestPart("image") MultipartFile image,
    @RequestParam(defaultValue = "false") boolean isPrimary
) { ... }

@GetMapping("/products/{productId}/images")
public List<ProductImageResponse> list(@PathVariable Long productId) { ... }

@PatchMapping("/admin/products/{productId}/images/{imageId}/primary")
@PreAuthorize("hasAnyRole('ADMIN','STAFF')")
public ProductImageResponse setPrimary(
    @PathVariable Long productId,
    @PathVariable Long imageId
) { ... }

@DeleteMapping("/admin/products/{productId}/images/{imageId}")
@PreAuthorize("hasAnyRole('ADMIN','STAFF')")
public ResponseEntity<Void> delete(
    @PathVariable Long productId,
    @PathVariable Long imageId
) { ... }

The UI sends a Bearer token from localStorage key mrt_access_token when one is present.
