package com.examly.springapp;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class SpringappApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @Order(1)
    void backend_test_Add_Book() throws Exception {
        String requestBody = "{\"id\":\"1\",\"title\": \"The Great Gatsby\", \"author\": \"F. Scott Fitzgerald\", \"genre\": \"Fiction\", \"publishedDate\": \"1925\", \"coverImage\": \"base64EncodedImage\"}";

        mockMvc.perform(MockMvcRequestBuilders.post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value("The Great Gatsby"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.author").value("F. Scott Fitzgerald"));
    }

    @Test
    @Order(2)
    void backend_test_Add_Book_With_Duplicate_Title() throws Exception {
        String bookJson = "{\"title\":\"Duplicate Book\",\"author\":\"Test Author\",\"genre\":\"Fiction\",\"publishedDate\":\"2024\",\"coverImage\":\"base64EncodedImage\"}";

        mockMvc.perform(MockMvcRequestBuilders.post("/api/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(bookJson)
                .accept(MediaType.APPLICATION_JSON));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(bookJson)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$").value("Failed to add book"));
    }

    @Test
    @Order(3)
    void backend_test_Get_AllBooks() throws Exception {
        mockMvc.perform(get("/api/books")
                .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @Order(4)
    void backend_test_Get_Book_ById() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/books/1")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value("The Great Gatsby"));
    }

    @Test
    @Order(5)
    void backend_test_Get_NonExistent_Book() throws Exception {
        mockMvc.perform(get("/api/books/999")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$").value("Book not found"));
    }

    @Test
    @Order(6)
    void backend_test_Update_Book() throws Exception {
        String updatedBookJson = "{\"title\":\"Updated Title\",\"author\":\"Updated Author\",\"genre\":\"Updated Genre\",\"publishedDate\":\"2024\",\"coverImage\":\"updatedImage\"}";

        mockMvc.perform(MockMvcRequestBuilders.put("/api/books/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatedBookJson)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value("Updated Title"));
    }

    @Test
    @Order(7)
    void backend_test_Delete_Book() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/books/1")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("Book deleted successfully"));
    }

    @Test
    @Order(8)
    public void backend_test_Controller_Directory_Exists() {
        String directoryPath = "src/main/java/com/examly/springapp/controller";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    @Order(9)
    public void backend_test_Model_Directory_Exists() {
        String directoryPath = "src/main/java/com/examly/springapp/model";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    @Order(10)
    public void backend_test_Service_Directory_Exists() {
        String directoryPath = "src/main/java/com/examly/springapp/service";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    @Order(11)
    public void backend_test_Repository_Directory_Exists() {
        String directoryPath = "src/main/java/com/examly/springapp/repository";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    @Order(12)
    public void backend_test_BookController_Class_Exists() {
        checkClassExists("com.examly.springapp.controller.BookController");
    }

    @Test
    @Order(13)
    public void backend_test_Book_Model_Class_Exists() {
        checkClassExists("com.examly.springapp.model.Book");
    }

    @Test
    @Order(14)
    public void backend_test_BookService_Class_Exists() {
        checkClassExists("com.examly.springapp.service.BookService");
    }

    @Test
    @Order(15)
    public void backend_test_BookRepository_Class_Exists() {
        checkClassExists("com.examly.springapp.repository.BookRepository");
    }

    @Test
    @Order(16)
    public void backend_test_Book_Model_Has_Required_Fields() {
        checkFieldExists("com.examly.springapp.model.Book", "bookId");
        checkFieldExists("com.examly.springapp.model.Book", "title");
        checkFieldExists("com.examly.springapp.model.Book", "author");
        checkFieldExists("com.examly.springapp.model.Book", "genre");
        checkFieldExists("com.examly.springapp.model.Book", "publishedDate");
        checkFieldExists("com.examly.springapp.model.Book", "coverImage");
    }

    @Test
    @Order(17)
    public void backend_test_BookRepository_Extends_JpaRepository() {
        checkClassImplementsInterface("com.examly.springapp.repository.BookRepository",
                "org.springframework.data.jpa.repository.JpaRepository");
    }

    @Test
    @Order(18)
    public void backend_test_CorsConfig_Class_Exists() {
        checkClassExists("com.examly.springapp.configuration.CorsConfig");
    }

    @Test
    @Order(19)
    public void backend_test_SwaggerConfig_Class_Exists() {
        checkClassExists("com.examly.springapp.configuration.SwaggerConfig");
    }

    @Test
    @Order(20)
    public void backend_test_BookException_Class_Exists() {
        checkClassExists("com.examly.springapp.exception.BookException");
    }

    @Test
    @Order(21)
    public void backend_test_BookException_Extends_Exception() {
        try {
            Class<?> clazz = Class.forName("com.examly.springapp.exception.BookException");
            assertTrue(Exception.class.isAssignableFrom(clazz),
                    "BookException should extend Exception");
        } catch (ClassNotFoundException e) {
            fail("BookException class does not exist.");
        }
    }

    private void checkClassExists(String className) {
        try {
            Class.forName(className);
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " does not exist.");
        }
    }

    private void checkFieldExists(String className, String fieldName) {
        try {
            Class<?> clazz = Class.forName(className);
            clazz.getDeclaredField(fieldName);
        } catch (ClassNotFoundException | NoSuchFieldException e) {
            fail("Field " + fieldName + " in class " + className + " does not exist.");
        }
    }

    private void checkClassImplementsInterface(String className, String interfaceName) {
        try {
            Class<?> clazz = Class.forName(className);
            Class<?> interfaceClazz = Class.forName(interfaceName);
            assertTrue(interfaceClazz.isAssignableFrom(clazz));
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " or interface " + interfaceName + " does not exist.");
        }
    }
}
